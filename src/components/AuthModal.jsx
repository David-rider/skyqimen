import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Mail, Lock, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const url = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication error');
      }

      if (isLogin) {
        alert(`${t('auth_success_login')} ${data.user.username}`);
        onSuccess(data.token, data.user);
        onClose();
      } else {
        alert(t('auth_success_register'));
        setIsLogin(true); // Switch to login screen
        setPassword('');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMessage(t('auth_error') + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchTab = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '400px', padding: '24px' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '50%', padding: '12px', marginBottom: '10px' }}>
            <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--text-white)', fontSize: '1.25rem' }}>
            {isLogin ? t('auth_title_login') : t('auth_title_register')}
          </h3>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{ background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', borderRadius: '8px', padding: '10px 14px', color: 'var(--accent-red)', fontSize: '0.75rem', marginBottom: '16px', lineHeight: '1.4' }}>
            {errorMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Username (Register Only) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">
                <User size={12} style={{ color: 'var(--accent-gold)' }} /> {t('auth_username')}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. zhangyouyuan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <Mail size={12} style={{ color: 'var(--accent-gold)' }} /> {t('auth_email')}
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={12} style={{ color: 'var(--accent-gold)' }} /> {t('auth_password')}
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-gold" 
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '10px', fontSize: '0.85rem' }}
          >
            {isLoading ? '...' : isLogin ? t('auth_btn_login') : t('auth_btn_register')}
          </button>

        </form>

        {/* Tab Switcher Link */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem' }}>
          <span 
            onClick={handleSwitchTab}
            style={{ color: 'var(--accent-cyan)', cursor: 'pointer', hover: { textDecoration: 'underline' } }}
          >
            {isLogin ? t('auth_switch_to_register') : t('auth_switch_to_login')}
          </span>
        </div>

      </div>
    </div>
  );
}
