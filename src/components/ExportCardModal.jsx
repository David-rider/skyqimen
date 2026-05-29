import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Share2, Compass } from 'lucide-react';

export default function ExportCardModal({ isOpen, onClose, chart, evaluation, forecast, userInfo }) {
  const { t, i18n } = useTranslation();

  if (!isOpen || !chart || !evaluation) return null;

  const locale = i18n.language === 'en' ? 'en-US' : 'zh-CN';
  const todayStr = new Date(chart.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const luckyDir = evaluation.luckyDirections[0] || { direction: '中宫', door: '生门', score: 80 };
  const userStem = forecast.userPillars.day[0];

  const getDirectionLabel = (dir) => {
    const map = {
      '北': 'N', '西南': 'SW', '东': 'E', '东南': 'SE', '中': 'C', '西北': 'NW', '西': 'W', '东北': 'NE', '南': 'S'
    };
    return i18n.language === 'en' ? map[dir] || dir : dir;
  };

  const getJuLabel = (name) => {
    if (i18n.language !== 'en') {
      if (i18n.language === 'tc') return name.replace('阳', '陽');
      return name;
    }
    const num = name.match(/\d/)?.[0] || '1';
    const isY = name.includes('阳');
    return `${isY ? 'Yang' : 'Yin'} Ju ${num}`;
  };

  const getPillarLabel = (val) => {
    if (i18n.language !== 'en') return val;
    return val.split('').map(c => t('stem_' + c) || t('branch_' + c) || c).join('-');
  };

  const getWisdomQuote = () => {
    if (i18n.language === 'en') {
      return `Today's time-space alignment is in dynamic motion. Orientation towards the ${getDirectionLabel(luckyDir.direction)} direction will align you with beneficial cosmic energy.`;
    }
    return evaluation.summary.split('。')[1] + '。';
  };

  const getGenderLabel = (g) => {
    if (i18n.language !== 'en') return g;
    return g === '男' ? 'M' : 'F';
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 3000 }}>
      <div className="modal-content" style={{ maxWidth: '420px', padding: '0', background: 'var(--bg-dark)', border: '1px solid var(--accent-gold)' }}>
        
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mystic)' }}>
            <Share2 size={14} /> {t('share_modal_title')}
          </span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Card Body */}
        <div id="export-tar-card" style={{
          padding: '24px',
          background: 'linear-gradient(180deg, #121026 0%, #06050b 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1.5px solid var(--accent-gold)'
        }}>
          {/* Constellation water lines */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '300px', height: '300px', border: '1px dashed rgba(212,175,55,0.04)', borderRadius: '50%', pointerEvents: 'none'
          }} />

          {/* Title */}
          <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(212,175,55,0.15)', paddingBottom: '12px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              QIMEN AI ORACLE CARD
            </div>
            <h2 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--text-white)', fontSize: '1.4rem', margin: '4px 0' }}>
              {t('share_modal_sub')}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {todayStr}
            </div>
          </div>

          {/* User Pillar Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px 14px' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('share_modal_owner')} {t('stem_' + userStem)})</div>
              <strong style={{ color: 'var(--text-white)', fontSize: '0.9rem' }}>{userInfo.name || '有缘人'} ({getGenderLabel(userInfo.gender)})</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('share_modal_ju')}</div>
              <strong style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}>{getJuLabel(chart.ju.name)}</strong>
            </div>
          </div>

          {/* Four Pillars Display */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
            {[[t('report_pillars_year').split(' ')[0], chart.pillars.year], [t('report_pillars_month').split(' ')[0], chart.pillars.month], [t('report_pillars_day').split(' ')[0], chart.pillars.day], [t('report_pillars_hour').split(' ')[0], chart.pillars.hour]].map(([label, val], idx) => (
              <div key={idx} style={{ background: 'rgba(22, 19, 47, 0.4)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '6px', padding: '6px 2px' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{label}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-mystic)' }}>{getPillarLabel(val)}</div>
              </div>
            ))}
          </div>

          {/* Rating Circle & Focus Advice */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(212,175,55,0.04)', border: '1.5px solid rgba(212,175,55,0.15)', borderRadius: '12px', padding: '14px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--accent-gold)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifycontent: 'center', flexShrink: 0,
              background: 'rgba(0,0,0,0.4)', boxShadow: '0 0 10px rgba(212,175,55,0.2)', padding: '6px 0'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold-light)', fontFamily: 'var(--font-mystic)', display: 'block', lineHeight: 1 }}>
                {evaluation.overallScore}
              </span>
              <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{t('share_modal_score').slice(0, 4)}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('share_modal_lucky_dir')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <Compass size={14} style={{ color: 'var(--accent-cyan)' }} />
                <strong style={{ color: 'var(--text-white)', fontSize: '0.9rem' }}>
                  {getDirectionLabel(luckyDir.direction)} ({t('door_' + luckyDir.door)})
                </strong>
              </div>
            </div>
          </div>

          {/* AI Quote Text */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px',
            fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.6', fontStyle: 'italic', position: 'relative'
          }}>
            <span style={{ position: 'absolute', top: '2px', left: '8px', fontSize: '1.5rem', color: 'rgba(212,175,55,0.15)', fontFamily: 'serif' }}>“</span>
            <p style={{ textIndent: '12px' }}>
              {getWisdomQuote()}
            </p>
            <span style={{ position: 'absolute', bottom: '-10px', right: '8px', fontSize: '1.5rem', color: 'rgba(212,175,55,0.15)', fontFamily: 'serif' }}>”</span>
          </div>

          {/* Watermark / QR Code */}
          <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '12px', height: '12px', border: '1.5px solid var(--accent-gold)', borderRadius: '50%' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-white)', fontWeight: 'bold' }}>{t('share_modal_watermark')}</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{t('share_modal_scan')}</div>
              </div>
            </div>
            
            <div style={{
              width: '42px', height: '42px', background: '#fff', borderRadius: '4px', padding: '4px',
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', flexShrink: 0
            }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{
                  background: (i * 7 + 19) % 2 === 0 ? '#000' : '#fff'
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Action helper */}
        <div style={{ padding: '14px', background: '#0e0c1f', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {t('share_modal_footer')}
        </div>

      </div>
    </div>
  );
}
