const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./database');
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'qimen_qiankun_secret_key_2026';

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE FOR JWT VERIFICATION ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authorization token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// --- USER AUTH ENDPOINTS ---

// 1. Register User
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO users (username, email, password, role, free_queries_left) VALUES (?, ?, ?, 'free', 3)`;
  db.run(query, [username, email, hashedPassword], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
      return res.status(500).json({ message: 'Database registration error: ' + err.message });
    }
    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
  });
});

// 2. Login User
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database login error' });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        freeQueriesLeft: user.free_queries_left,
        apiKey: user.api_key
      }
    });
  });
});

// 3. Get Logged-in User Profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const query = `SELECT id, username, email, role, free_queries_left, api_key FROM users WHERE id = ?`;
  db.get(query, [req.user.id], (err, user) => {
    if (err || !user) return res.status(500).json({ message: 'Error retrieving profile' });
    res.json({ user });
  });
});

// 4. Save Google Gemini API Key in DB
app.post('/api/user/save-apikey', authenticateToken, (req, res) => {
  const { apiKey } = req.body;
  const query = `UPDATE users SET api_key = ? WHERE id = ?`;
  db.run(query, [apiKey, req.user.id], function (err) {
    if (err) return res.status(500).json({ message: 'Error saving API Key' });
    res.json({ message: 'API Key saved securely in profile database.' });
  });
});

// --- DIVINATION / USAGE LIMITS ENDPOINTS ---

// 1. Get queries limit status
app.get('/api/divination/limit', authenticateToken, (req, res) => {
  const query = `SELECT role, free_queries_left FROM users WHERE id = ?`;
  db.get(query, [req.user.id], (err, user) => {
    if (err || !user) return res.status(500).json({ message: 'Database error' });
    res.json({
      role: user.role,
      freeQueriesLeft: user.free_queries_left
    });
  });
});

// 2. Consume a Free AI query
app.post('/api/divination/use-query', authenticateToken, (req, res) => {
  db.get(`SELECT role, free_queries_left FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(500).json({ message: 'Database error' });
    
    if (user.role !== 'free') {
      return res.json({ message: 'Unlimited queries active', freeQueriesLeft: user.free_queries_left });
    }

    if (user.free_queries_left <= 0) {
      return res.status(403).json({ message: 'Queries limit depleted' });
    }

    const nextQueries = user.free_queries_left - 1;
    db.run(`UPDATE users SET free_queries_left = ? WHERE id = ?`, [nextQueries, req.user.id], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update queries balance' });
      res.json({ message: 'Query recorded successfully', freeQueriesLeft: nextQueries });
    });
  });
});

// 3. Reset queries for testing (Demo Utility)
app.post('/api/divination/reset-queries', authenticateToken, (req, res) => {
  db.run(`UPDATE users SET free_queries_left = 3 WHERE id = ?`, [req.user.id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to reset queries' });
    res.json({ message: 'Free query limits reset to 3 times in DB.' });
  });
});

// 4. Save Divination Query to History Database
app.post('/api/divination/save-history', authenticateToken, (req, res) => {
  const { name, gender, birthDate, birthHour, longitude, focus, chartJson } = req.body;

  const query = `
    INSERT INTO queries_history (user_id, name, gender, birth_date, birth_hour, longitude, focus, chart_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [req.user.id, name, gender, birthDate, birthHour, longitude, focus, JSON.stringify(chartJson)], function (err) {
    if (err) return res.status(500).json({ message: 'Failed to save query history: ' + err.message });
    res.json({ message: 'Query logged in history database successfully', historyId: this.lastID });
  });
});

// 5. Get History List
app.get('/api/divination/history', authenticateToken, (req, res) => {
  const query = `SELECT id, name, gender, birth_date, birth_hour, longitude, focus, chart_json, created_at FROM queries_history WHERE user_id = ? ORDER BY created_at DESC`;
  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to retrieve query history' });
    
    // Parse chart JSON strings
    const history = rows.map(r => ({
      ...r,
      chartJson: JSON.parse(r.chart_json)
    }));
    res.json({ history });
  });
});

// 6. Delete History Record
app.delete('/api/divination/history/:id', authenticateToken, (req, res) => {
  const query = `DELETE FROM queries_history WHERE id = ? AND user_id = ?`;
  db.run(query, [req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to delete history record' });
    if (this.changes === 0) return res.status(404).json({ message: 'Record not found or unauthorized' });
    res.json({ message: 'History record deleted successfully' });
  });
});

// --- SECURE TRANSACTIONS & PAYMENTS ENDPOINTS ---

// 1. Create a Pending Order
app.post('/api/payment/create-order', authenticateToken, (req, res) => {
  const { amount, currency, platform } = req.body;

  if (!amount || !platform) {
    return res.status(400).json({ message: 'Amount and payment platform are required' });
  }

  // Create a unique transaction ID
  const transactionId = 'TXN_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  const query = `INSERT INTO payments (user_id, amount, currency, platform, status, transaction_id) VALUES (?, ?, ?, ?, 'pending', ?)`;
  db.run(query, [req.user.id, amount, currency || 'CNY', platform, transactionId], function (err) {
    if (err) return res.status(500).json({ message: 'Error generating order record: ' + err.message });
    
    res.json({
      message: 'Order created',
      order: {
        orderId: this.lastID,
        amount,
        currency: currency || 'CNY',
        platform,
        transactionId
      }
    });
  });
});

// 2. Confirm Order & Upgrade User
app.post('/api/payment/confirm-order', authenticateToken, (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  // 1. Check if the payment exists
  db.get(`SELECT * FROM payments WHERE transaction_id = ?`, [transactionId], (err, order) => {
    if (err || !order) return res.status(404).json({ message: 'Order transaction record not found' });
    
    if (order.status === 'completed') {
      return res.json({ message: 'Order already completed', role: req.user.role });
    }

    // 2. Update payment status to completed
    db.run(`UPDATE payments SET status = 'completed' WHERE transaction_id = ?`, [transactionId], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update transaction status' });
      
      // Determine new role (e.g. Pro or VIP) depending on amount
      const targetRole = order.amount >= 198 ? 'vip' : 'pro';

      // 3. Update user role in the users database
      db.run(`UPDATE users SET role = ? WHERE id = ?`, [targetRole, req.user.id], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to activate premium user privileges' });
        
        res.json({
          message: 'Simulated payment transaction verified successfully!',
          role: targetRole,
          amount: order.amount,
          platform: order.platform
        });
      });
    });
  });
});

// --- PORT LISTENER ---
app.listen(PORT, () => {
  console.log(`Secure backend server is listening on port ${PORT}`);
});
