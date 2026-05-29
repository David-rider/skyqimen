import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, RotateCw, Share2 } from 'lucide-react';

// Traditional Luo Shu layout order:
// 4 (巽 SE) | 9 (离 S) | 2 (坤 SW)
// 3 (震 E)  | 5 (中 C) | 7 (兑 W)
// 8 (艮 NE) | 1 (坎 N) | 6 (乾 NW)
const LUOSH_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export default function QiMenBoard({ chart, activePalaceId, onPalaceSelect, onExportCard }) {
  const { t, i18n } = useTranslation();
  const { board, ju, pillars } = chart;

  const isDoorLucky = (door) => {
    return ['开门', '生门', '休门'].includes(door);
  };

  const isDoorUnlucky = (door) => {
    return ['死门', '惊门', '伤门'].includes(door);
  };

  const isStarLucky = (star) => {
    return ['天辅', '天禽', '天心', '天任'].includes(star);
  };

  const isDeityLucky = (deity) => {
    return ['值符', '六合', '太阴', '九地', '九天'].includes(deity);
  };

  const getDirectionLabel = (dir) => {
    const map = {
      '北': 'N', '西南': 'SW', '东': 'E', '东南': 'SE', '中': 'C', '西北': 'NW', '西': 'W', '东北': 'NE', '南': 'S'
    };
    return i18n.language === 'en' ? map[dir] || dir : dir;
  };

  const getJuLabel = (name) => {
    if (i18n.language !== 'en') {
      if (i18n.language === 'tc') {
        return name.replace('阳', '陽');
      }
      return name;
    }
    const num = name.match(/\d/)?.[0] || '1';
    const isY = name.includes('阳');
    return `${isY ? 'Yang' : 'Yin'} Ju ${num}`;
  };

  const getXunLabel = (xun) => {
    if (i18n.language !== 'en') return xun;
    return xun.split('').map(c => t('stem_' + c) || c).join('-');
  };

  return (
    <div className="qimen-container">
      <div className="qimen-header-bar">
        <div>
          <h2 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--accent-gold)' }}>
            {t('board_title')}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t('board_ju')}：<span style={{ color: 'var(--text-white)', fontWeight: 600 }}>{getJuLabel(ju.name)}</span> | 
            {t('board_xun')}：<span style={{ color: 'var(--text-white)', fontWeight: 600 }}>{getXunLabel(ju.xun)}</span> | 
            {t('board_zhifu')}：<span style={{ color: 'var(--accent-gold-light)' }}>{t('star_' + ju.zhiFuStar)}</span> | 
            {t('board_zhishi')}：<span style={{ color: 'var(--accent-cyan)' }}>{t('door_' + ju.zhiShiDoor)}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={onExportCard} className="btn-outline-gold" style={{ fontSize: '0.75rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <Share2 size={12} /> {t('board_share_btn')}
          </button>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {chart.isRealTime ? t('board_realtime') : t('board_targettime')}
          </span>
        </div>
      </div>

      <div className="qimen-grid">
        {LUOSH_ORDER.map((id) => {
          const cell = board[id];
          
          if (id === 5) {
            return (
              <div key={id} className="qimen-cell center-palace">
                <div className="center-bagua-wrapper">
                  <svg className="bagua-wheel" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="#d4af37" strokeWidth="2" strokeDasharray="6 3"/>
                    <path d="M50 5A45 45 0 0 1 50 95A45 45 0 0 1 50 5" stroke="#d4af37" strokeWidth="1"/>
                    <path d="M50 5v90M5 50h90M18 18l64 64M82 18L18 82" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1"/>
                    <circle cx="50" cy="50" r="12" fill="#0e0c1f" stroke="#d4af37" strokeWidth="1"/>
                    <circle cx="50" cy="44" r="2.5" fill="#d4af37"/>
                    <circle cx="50" cy="56" r="2.5" fill="#0e0c1f" stroke="#d4af37" strokeWidth="0.5"/>
                  </svg>
                  <div className="ju-indicator">{ju.name.slice(2)}</div>
                  <div className="ju-desc">{i18n.language === 'en' ? (ju.name.includes('阳') ? 'Yang' : 'Yin') : ju.name.slice(0, 2)}</div>
                </div>
              </div>
            );
          }

          const isActive = activePalaceId === id;
          const isLucky = isDoorLucky(cell.door);
          const isUnlucky = isDoorUnlucky(cell.door);
          
          return (
            <div
              key={id}
              className={`qimen-cell ${isActive ? 'active-palace' : ''} ${cell.isEmpty ? 'empty-palace' : ''}`}
              onClick={() => onPalaceSelect(id)}
            >
              {/* Top Row: Deity & Palace Label */}
              <div className="cell-top-row">
                <span className={`cell-deity ${isDeityLucky(cell.deity) ? 'deity-lucky' : ''}`}>
                  {t('deity_' + cell.deity)}
                </span>
                <span className="cell-palace-num">
                  {getDirectionLabel(cell.info.direction)}
                </span>
              </div>

              {/* Middle Row: Star & Door */}
              <div className="cell-middle-row">
                <span className={`cell-star ${isStarLucky(cell.star) ? 'star-lucky' : ''}`}>
                  {cell.star !== '无' ? t('star_' + cell.star).replace('星', '') : '无'}
                </span>
                <span className={`cell-door ${isLucky ? 'door-lucky' : isUnlucky ? 'door-unlucky' : 'door-neutral'}`}>
                  {t('door_' + cell.door).replace(' Gate', '')}
                </span>
              </div>

              {/* Bottom Row: Tian Pan / Di Pan Stems */}
              <div className="cell-bottom-row">
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mystic)' }}>
                  {i18n.language === 'en' ? cell.info.english.split(' ')[0] : (i18n.language === 'tc' && cell.info.gua === '兑') ? '兌' : cell.info.gua}
                </span>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                  <span className="stem-tian">{t('stem_' + cell.tianPan)}</span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>/</span>
                  <span className="stem-di">{t('stem_' + cell.diPan)}</span>
                </div>
              </div>

              {/* Empty Tag (旬空) */}
              {cell.isEmpty && <div className="cell-empty-tag">{t('board_void')}</div>}
            </div>
          );
        })}
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
        {t('board_click_tip')}
      </p>
    </div>
  );
}
