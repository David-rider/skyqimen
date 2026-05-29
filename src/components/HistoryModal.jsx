import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, Clock, Compass, Trash2, ArrowUpRight } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, historyList, onSelectHistory, onDeleteHistory }) {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(i18n.language === 'en' ? 'en-US' : 'zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '600px', padding: '24px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--accent-gold)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} />
            {i18n.language === 'en' ? 'My Prediction History' : i18n.language === 'tc' ? '我的預測歷史' : '我的预测历史'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
            {i18n.language === 'en' 
              ? 'Click to restore any calculated chart from the secure database.' 
              : '点击直接载入历史起卦，数据已在安全数据库中同步。'}
          </p>
        </div>

        {/* History List Scroll Area */}
        <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {historyList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {i18n.language === 'en' 
                ? 'No history records found. Perform a divination to save your first prediction!' 
                : '暂无历史记录。在主页面进行起盘测算，系统将自动安全保存您的记录！'}
            </div>
          ) : (
            historyList.map((item) => (
              <div 
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                }}
                className="history-item-hover"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: 'var(--text-white)', fontSize: '0.9rem' }}>{item.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({item.gender === '男' ? '乾造' : '坤造'})</span>
                    <span 
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: item.focus === 'career' ? 'rgba(57, 197, 187, 0.15)' : item.focus === 'wealth' ? 'rgba(212, 175, 55, 0.15)' : item.focus === 'love' ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        color: item.focus === 'career' ? 'var(--accent-cyan)' : item.focus === 'wealth' ? 'var(--accent-gold)' : item.focus === 'love' ? '#ff4d4d' : 'var(--text-light)',
                        border: `1px solid ${item.focus === 'career' ? 'rgba(57, 197, 187, 0.25)' : item.focus === 'wealth' ? 'rgba(212, 175, 55, 0.25)' : item.focus === 'love' ? 'rgba(255, 77, 77, 0.25)' : 'rgba(255, 255, 255, 0.15)'}`
                      }}
                    >
                      {t('focus_' + item.focus)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      <span>{item.birth_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>{item.birth_hour}时 / Hour</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Compass size={12} />
                      <span>{item.longitude}°E</span>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {formatDate(item.created_at)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => { onSelectHistory(item); onClose(); }}
                    className="btn-outline-cyan"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>{i18n.language === 'en' ? 'Load' : '载入'}</span>
                    <ArrowUpRight size={12} />
                  </button>
                  {onDeleteHistory && (
                    <button 
                      onClick={() => onDeleteHistory(item.id)}
                      style={{
                        background: 'rgba(255, 77, 77, 0.08)',
                        border: '1px solid rgba(255, 77, 77, 0.2)',
                        color: '#ff4d4d',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition-smooth)'
                      }}
                      className="btn-hover-danger"
                      title={i18n.language === 'en' ? 'Delete' : '删除'}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
