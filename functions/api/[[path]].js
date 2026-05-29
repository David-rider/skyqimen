import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = new Hono().basePath('/api');
const JWT_SECRET = 'qimen_qiankun_secret_key_2026';

// Middleware for JWT verification
const authenticateToken = async (c, next) => {
  const authHeader = c.req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return c.json({ message: 'Authorization token required' }, 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set('user', decoded);
    await next();
  } catch (err) {
    return c.json({ message: 'Invalid or expired token' }, 403);
  }
};

// --- AUTH ROUTER ---

// 1. Register User
app.post('/auth/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();

    if (!username || !email || !password) {
      return c.json({ message: 'Username, email and password are required' }, 400);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const db = c.env.DB;

    const info = await db.prepare(
      `INSERT INTO users (username, email, password, role, free_queries_left) VALUES (?, ?, ?, 'free', 3)`
    ).bind(username, email, hashedPassword).run();

    return c.json({ message: 'User registered successfully', userId: info.meta.last_row_id }, 201);
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return c.json({ message: 'Username or email already exists' }, 400);
    }
    return c.json({ message: 'Database registration error: ' + err.message }, 500);
  }
});

// 2. Login User
app.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ message: 'Email and password are required' }, 400);
    }

    const db = c.env.DB;
    const user = await db.prepare(`SELECT * FROM users WHERE email = ?`).bind(email).first();

    if (!user) {
      return c.json({ message: 'User not found' }, 400);
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return c.json({ message: 'Invalid credentials' }, 400);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return c.json({
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
  } catch (err) {
    return c.json({ message: 'Database login error: ' + err.message }, 500);
  }
});

// 3. Get profile
app.get('/auth/profile', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const db = c.env.DB;
    const user = await db.prepare(
      `SELECT id, username, email, role, free_queries_left, api_key FROM users WHERE id = ?`
    ).bind(userPayload.id).first();

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    return c.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        freeQueriesLeft: user.free_queries_left,
        apiKey: user.api_key
      }
    });
  } catch (err) {
    return c.json({ message: 'Error retrieving profile: ' + err.message }, 500);
  }
});

// 4. Save API Key
app.post('/user/save-apikey', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const { apiKey } = await c.req.json();
    const db = c.env.DB;

    await db.prepare(`UPDATE users SET api_key = ? WHERE id = ?`).bind(apiKey, userPayload.id).run();
    return c.json({ message: 'API Key saved securely in profile database.' });
  } catch (err) {
    return c.json({ message: 'Error saving API Key: ' + err.message }, 500);
  }
});

// --- DIVINATION ROUTER ---

// 1. Get limit status
app.get('/divination/limit', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const db = c.env.DB;
    const user = await db.prepare(`SELECT role, free_queries_left FROM users WHERE id = ?`).bind(userPayload.id).first();

    if (!user) return c.json({ message: 'User not found' }, 404);

    return c.json({
      role: user.role,
      freeQueriesLeft: user.free_queries_left
    });
  } catch (err) {
    return c.json({ message: 'Database error: ' + err.message }, 500);
  }
});

// 2. Consume a Free AI query
app.post('/divination/use-query', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const db = c.env.DB;
    const user = await db.prepare(`SELECT role, free_queries_left FROM users WHERE id = ?`).bind(userPayload.id).first();

    if (!user) return c.json({ message: 'User not found' }, 404);

    if (user.role !== 'free') {
      return c.json({ message: 'Unlimited queries active', freeQueriesLeft: user.free_queries_left });
    }

    if (user.free_queries_left <= 0) {
      return c.json({ message: 'Queries limit depleted' }, 403);
    }

    const nextQueries = user.free_queries_left - 1;
    await db.prepare(`UPDATE users SET free_queries_left = ? WHERE id = ?`).bind(nextQueries, userPayload.id).run();

    return c.json({ message: 'Query recorded successfully', freeQueriesLeft: nextQueries });
  } catch (err) {
    return c.json({ message: 'Failed to update queries balance: ' + err.message }, 500);
  }
});

// 3. Reset queries
app.post('/divination/reset-queries', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const db = c.env.DB;
    await db.prepare(`UPDATE users SET free_queries_left = 3 WHERE id = ?`).bind(userPayload.id).run();
    return c.json({ message: 'Free query limits reset to 3 times in DB.' });
  } catch (err) {
    return c.json({ message: 'Failed to reset queries: ' + err.message }, 500);
  }
});

// 4. Save History
app.post('/divination/save-history', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const { name, gender, birthDate, birthHour, longitude, focus, chartJson } = await c.req.json();
    const db = c.env.DB;

    const info = await db.prepare(`
      INSERT INTO queries_history (user_id, name, gender, birth_date, birth_hour, longitude, focus, chart_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(userPayload.id, name, gender, birthDate, birthHour, longitude, focus, JSON.stringify(chartJson)).run();

    return c.json({ message: 'Query logged in history database successfully', historyId: info.meta.last_row_id });
  } catch (err) {
    return c.json({ message: 'Failed to save query history: ' + err.message }, 500);
  }
});

// 5. Get History List
app.get('/divination/history', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const db = c.env.DB;
    const { results } = await db.prepare(
      `SELECT id, name, gender, birth_date, birth_hour, longitude, focus, chart_json, created_at FROM queries_history WHERE user_id = ? ORDER BY created_at DESC`
    ).bind(userPayload.id).all();

    const history = results.map(r => ({
      ...r,
      chartJson: JSON.parse(r.chart_json)
    }));

    return c.json({ history });
  } catch (err) {
    return c.json({ message: 'Failed to retrieve query history: ' + err.message }, 500);
  }
});

// 6. Delete History Record
app.delete('/divination/history/:id', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const id = c.req.param('id');
    const db = c.env.DB;

    const info = await db.prepare(`DELETE FROM queries_history WHERE id = ? AND user_id = ?`).bind(id, userPayload.id).run();

    if (info.meta.changes === 0) {
      return c.json({ message: 'Record not found or unauthorized' }, 404);
    }

    return c.json({ message: 'History record deleted successfully' });
  } catch (err) {
    return c.json({ message: 'Failed to delete history record: ' + err.message }, 500);
  }
});

// --- PAYMENTS ROUTER ---

// 1. Create Order
app.post('/payment/create-order', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const { amount, currency, platform } = await c.req.json();

    if (!amount || !platform) {
      return c.json({ message: 'Amount and payment platform are required' }, 400);
    }

    const transactionId = 'TXN_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const db = c.env.DB;

    const info = await db.prepare(
      `INSERT INTO payments (user_id, amount, currency, platform, status, transaction_id) VALUES (?, ?, ?, ?, 'pending', ?)`
    ).bind(userPayload.id, amount, currency || 'CNY', platform, transactionId).run();

    return c.json({
      message: 'Order created',
      order: {
        orderId: info.meta.last_row_id,
        amount,
        currency: currency || 'CNY',
        platform,
        transactionId
      }
    });
  } catch (err) {
    return c.json({ message: 'Error generating order record: ' + err.message }, 500);
  }
});

// 2. Confirm Order & Upgrade User
app.post('/payment/confirm-order', authenticateToken, async (c) => {
  try {
    const userPayload = c.get('user');
    const { transactionId } = await c.req.json();

    if (!transactionId) {
      return c.json({ message: 'Transaction ID is required' }, 400);
    }

    const db = c.env.DB;
    const order = await db.prepare(`SELECT * FROM payments WHERE transaction_id = ?`).bind(transactionId).first();

    if (!order) {
      return c.json({ message: 'Order transaction record not found' }, 404);
    }

    if (order.status === 'completed') {
      return c.json({ message: 'Order already completed', role: userPayload.role });
    }

    await db.prepare(`UPDATE payments SET status = 'completed' WHERE transaction_id = ?`).bind(transactionId).run();

    const targetRole = order.amount >= 198 ? 'vip' : 'pro';

    await db.prepare(`UPDATE users SET role = ? WHERE id = ?`).bind(targetRole, userPayload.id).run();

    return c.json({
      message: 'Simulated payment transaction verified successfully!',
      role: targetRole,
      amount: order.amount,
      platform: order.platform
    });
  } catch (err) {
    return c.json({ message: 'Failed to confirm order: ' + err.message }, 500);
  }
});

export const onRequest = handle(app);
