import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Key, Info } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey
}) {
  const { t, i18n } = useTranslation();
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showTips, setShowTips] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    alert(t('settings_saved_alert'));
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
    alert(t('settings_cleared_alert'));
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Key size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--text-white)' }}>
            {t('settings_title')}
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {t('settings_desc')}
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--accent-cyan)' }}>
              {t('settings_label')}
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="AIxxSyxx..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              style={{ letterSpacing: keyInput ? '3px' : 'normal' }}
            />
          </div>

          <div 
            onClick={() => setShowTips(!showTips)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-gold-light)', cursor: 'pointer', userSelect: 'none' }}
          >
            <Info size={12} />
            {t('settings_how')}
          </div>

          {showTips && (
            <div style={{
              background: 'rgba(212, 175, 55, 0.06)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.75rem',
              color: 'var(--text-light)',
              lineHeight: '1.6',
              whiteSpace: 'pre-line'
            }}>
              {t('settings_how_desc')}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={handleClear}
              className="btn-outline-gold" 
              style={{ flexGrow: 1 }}
            >
              {t('settings_clear')}
            </button>
            <button 
              type="submit" 
              className="btn-gold" 
              style={{ flexGrow: 2, justifyContent: 'center', background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #00b8d4 100%)', color: '#06050b' }}
            >
              {t('settings_save')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
