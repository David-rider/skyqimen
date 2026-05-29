import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Sparkles, Settings, AlertCircle, RefreshCw } from 'lucide-react';

export default function AIConsultant({
  chatHistory,
  onSendMessage,
  isSending,
  isPremium,
  freeQueriesLeft,
  onOpenSettings,
  onOpenUpgrade
}) {
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isSending]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;
    
    if (!isPremium && freeQueriesLeft <= 0) {
      alert(i18n.language === 'en' 
        ? "Free queries limit reached. Please upgrade or configure your Gemini API Key." 
        : i18n.language === 'tc'
        ? "免費天機額度已用完，請升級訂閱或設置您自己的 Gemini API 密鑰。"
        : "免费天机额度已用完，请升级订阅或设置您自己的 Gemini API 密钥。");
      onOpenUpgrade();
      return;
    }
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="glass-panel-cyan chat-panel">
      {/* Chat Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
        paddingBottom: '12px',
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--text-white)' }}>
            {t('ai_title')}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isPremium && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('ai_free_queries')}: <strong style={{ color: 'var(--accent-cyan)' }}>{freeQueriesLeft}</strong>
            </span>
          )}
          {isPremium && (
            <span className="badge-vip" style={{ boxShadow: 'none', background: 'rgba(0, 240, 255, 0.2)', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)' }}>
              {t('ai_vip_unlocked')}
            </span>
          )}
          <button 
            onClick={onOpenSettings} 
            className="btn-outline-cyan" 
            style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title={t('nav_api_settings')}
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`message-bubble ${msg.sender === 'user' ? 'message-user' : 'message-ai'}`}
          >
            {msg.text}
          </div>
        ))}
        {isSending && (
          <div className="message-bubble message-ai" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
            <RefreshCw size={14} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
            <span>{t('ai_loading')}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Credits depletion warning */}
      {!isPremium && freeQueriesLeft <= 0 && (
        <div style={{
          background: 'rgba(255, 77, 77, 0.1)',
          border: '1px solid rgba(255, 77, 77, 0.3)',
          borderRadius: '8px',
          padding: '10px 14px',
          margin: '0 12px 6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.8rem'
        }}>
          <AlertCircle size={16} style={{ color: 'var(--accent-red)' }} />
          <div style={{ flexGrow: 1 }}>
            {t('ai_queries_depleted')}
          </div>
          <button onClick={onOpenUpgrade} className="btn-gold" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
            {t('ai_queries_depleted_btn')}
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder={
            !isPremium && freeQueriesLeft <= 0
              ? t('ai_input_placeholder_depleted')
              : t('ai_input_placeholder')
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSending || (!isPremium && freeQueriesLeft <= 0)}
        />
        <button
          type="submit"
          className="btn-gold"
          style={{
            padding: '10px 16px',
            background: isPremium ? 'linear-gradient(135deg, var(--accent-cyan) 0%, #00b8d4 100%)' : undefined,
            color: isPremium ? '#06050b' : undefined,
            boxShadow: isPremium ? '0 4px 12px rgba(0, 240, 255, 0.25)' : undefined,
            cursor: 'pointer'
          }}
          disabled={isSending || !inputValue.trim() || (!isPremium && freeQueriesLeft <= 0)}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
