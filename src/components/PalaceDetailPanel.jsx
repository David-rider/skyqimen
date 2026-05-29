import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Shield, Sparkles, Compass } from 'lucide-react';
import { STARS, DOORS, DEITIES } from '../utils/qimen';

export default function PalaceDetailPanel({
  palaceId,
  chart,
  evaluation,
  onClose
}) {
  const { t, i18n } = useTranslation();

  if (!palaceId) return null;

  const cell = chart.board[palaceId];
  const interpretation = evaluation.palaceInterpretations[palaceId];
  
  if (!cell || !interpretation) return null;

  const getElementBadgeClass = (el) => {
    switch (el) {
      case '水': return 'element-water';
      case '火': return 'element-fire';
      case '金': return 'element-metal';
      case '木': return 'element-wood';
      case '土': return 'element-earth';
      default: return '';
    }
  };

  const getElementLabel = (el) => {
    if (i18n.language !== 'en') return `属${el}`;
    const map = { '水': 'Water', '火': 'Fire', '金': 'Metal', '木': 'Wood', '土': 'Earth' };
    return map[el] || el;
  };

  const getPalaceNameLabel = (name) => {
    if (i18n.language !== 'en') {
      if (i18n.language === 'tc') return name.replace('宫', '宮');
      return name;
    }
    const map = {
      '坎宫': 'Kan Palace', '坤宫': 'Kun Palace', '震宫': 'Zhen Palace', '巽宫': 'Xun Palace',
      '中宫': 'Zhong Palace', '乾宫': 'Qian Palace', '兑宫': 'Dui Palace', '艮宫': 'Gen Palace', '离宫': 'Li Palace'
    };
    return map[name] || name;
  };

  const getStrengthLabel = (str) => {
    if (i18n.language !== 'en') return str;
    const map = { '旺': 'Wang (Prosperous)', '相': 'Xiang (Strong)', '休': 'Xiu (Resting)', '囚': 'Qiu (Trapped)', '死': 'Si (Dead)' };
    return map[str] || str;
  };

  const getDirectionLabel = (dir) => {
    const map = {
      '北': 'N', '西南': 'SW', '东': 'E', '东南': 'SE', '中': 'C', '西北': 'NW', '西': 'W', '东北': 'NE', '南': 'S'
    };
    return i18n.language === 'en' ? map[dir] || dir : dir;
  };

  const getCombinationLabel = (name) => {
    if (i18n.language !== 'en') return name;
    const map = {
      '飞鸟跌穴': 'Bird Falls into Cave (Fei Niao Die Xue) - Great Auspicious',
      '青龙返首': 'Green Dragon Returns Head (Qing Long Fan Shou) - Great Auspicious',
      '朱雀投江': 'Phoenix Drowns in River (Zhu Que Tou Jiang) - Danger',
      '腾蛇夭矫': 'Snake Coiling Up (Teng She Yao Jiao) - Great Danger',
      '五不遇时': 'Five Unmet Hours (Wu Bu Yu Shi) - Obstacles',
      '星门伏吟': 'Stars & Gates Fu Yin (Stillness) - Slow/Defensive',
      '星门反吟': 'Stars & Gates Fan Yin (Reversal) - Chaotic Changes',
      '青龙逃走': 'Dragon Escapes (Qing Long Tao Zou) - Loss',
      '白虎猖狂': 'Tiger Raging (Bai Hu Chang Kuang) - Major Clashes/Accidents'
    };
    const baseName = name.split(' (')[0];
    const mapped = map[baseName] || name;
    return name.includes(' (在') ? name.replace(baseName, mapped) : mapped;
  };

  const getCombinationDescLabel = (desc, name) => {
    if (i18n.language !== 'en') return desc;
    const map = {
      '飞鸟跌穴': 'The Fire (Bing) falls into Earth (Wu). Top-tier layout! Easy gains, abundant wealth, smoothly resolves obstacles.',
      '青龙返首': 'The Wood (Wu) meets Fire (Bing). Highly auspicious! Favorable for investments, launching businesses, promotions.',
      '朱雀投江': 'The Fire (Ding) meets Water (Gui). Obstacles in documents, gossip, theft, or sudden legal disputes.',
      '腾蛇夭矫': 'The Water (Gui) meets Fire (Ding). Sudden shocks, nightmares, deceptions, or severe disputes.',
      '五不遇时': 'The Hour stem controls the Day stem. High conflicts, plans are easily blocked, best to remain static.',
      '星门伏吟': 'Stars and doors are in their original positions. Progress is halted, favorable for defending, bad for attacking.',
      '星门反吟': 'Stars and doors are in opposing positions. Rapid changes, chaos, travel, best to act quickly.'
    };
    const baseName = name.split(' (')[0];
    return map[baseName] || desc;
  };

  const getQualityBadgeColor = (q) => {
    if (q === '大吉' || q === '吉') return '#00ffcc';
    if (q === '凶' || q === '大凶') return '#ff4d4d';
    return 'var(--text-muted)';
  };

  const starInfo = STARS[cell.star] || { quality: '中平', desc: '未知九星气场。' };
  const doorInfo = DOORS[cell.door] || { quality: '中平', desc: '未知八门气场。' };
  const deityInfo = DEITIES[cell.deity] || { quality: '中平', desc: '未知八神气场。' };

  return (
    <>
      <div className="slideover-backdrop" onClick={onClose} />
      
      <div className="slideover-panel">
        {/* Header */}
        <div className="slideover-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ color: 'var(--accent-gold-light)' }}>
                {getPalaceNameLabel(cell.info.name)} ({getDirectionLabel(cell.info.direction)})
              </h2>
              <span className={`element-tag ${getElementBadgeClass(cell.info.element)}`}>
                {getElementLabel(cell.info.element)}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {t('palace_number')}: {cell.info.number} | {t('palace_gua')}: {cell.info.gua} | {t('palace_strength')}: 【{getStrengthLabel(cell.strength)}】
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {interpretation.score}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{t('share_modal_score')}</div>
            </div>
            <button className="slideover-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Palace Layout Stems Grid */}
        <div style={{
          background: 'rgba(22, 19, 47, 0.4)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('palace_tian_label')}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{t('stem_' + cell.tianPan)}</div>
          </div>
          <div style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.15)' }}>{t('palace_lin')}</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('palace_di_label')}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-muted)' }}>{t('stem_' + cell.diPan)}</div>
          </div>
        </div>

        {/* Structure Pattern */}
        <div>
          <h4 style={{ color: 'var(--accent-gold)', marginBottom: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> {t('palace_theory')} ({getCombinationLabel(interpretation.combinationName)})
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.6', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', padding: '12px', borderRadius: '8px' }}>
            {getCombinationDescLabel(interpretation.combinationDesc, interpretation.combinationName)}
          </p>
        </div>

        {/* Deity / Star / Door Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ color: 'var(--text-white)', fontSize: '0.95rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
            {t('palace_analysis')}
          </h4>

          {/* Deity */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold-light)',
              width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0
            }}>
              {t('palace_shen')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ color: 'var(--text-white)' }}>{t('deity_' + cell.deity)}</strong>
                <span style={{ fontSize: '0.7rem', color: getQualityBadgeColor(deityInfo.quality) }}>({deityInfo.quality})</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                {i18n.language === 'en' ? 'Energy of the deity governs local spirits. Auspicious for protection.' : deityInfo.desc}
              </p>
            </div>
          </div>

          {/* Star */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)',
              width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0
            }}>
              {t('palace_xing')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ color: 'var(--text-white)' }}>{t('star_' + cell.star)}</strong>
                <span style={{ fontSize: '0.7rem', color: getQualityBadgeColor(starInfo.quality) }}>({starInfo.quality})</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                {i18n.language === 'en' ? 'Heavenly parameters determining outer timing factors.' : starInfo.desc}
              </p>
            </div>
          </div>

          {/* Door */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              background: 'rgba(138, 43, 226, 0.15)', border: '1px solid var(--accent-purple)', color: '#b180ff',
              width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0
            }}>
              {t('palace_men')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ color: 'var(--text-white)' }}>{t('door_' + cell.door)}</strong>
                <span style={{ fontSize: '0.7rem', color: getQualityBadgeColor(doorInfo.quality) }}>({doorInfo.quality})</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                {i18n.language === 'en' ? 'Spatial gate governing active human affairs.' : doorInfo.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Business/Personal Strategy Advice */}
        <div style={{
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          background: 'radial-gradient(circle at top right, rgba(0, 240, 255, 0.08) 0%, rgba(14, 12, 31, 0.5) 100%)',
          marginTop: '8px'
        }}>
          <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={14} /> {t('palace_directive')}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
            {i18n.language === 'en' 
              ? 'Auspicious strategy guidelines are prepared based on elements clashing. Favorable directions apply.'
              : interpretation.domainAdvise}
          </p>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '8px'
          }}>
            <b>{t('palace_directive_strategy')}</b>：{t('palace_direction_stay')} <b>{getDirectionLabel(cell.info.direction)}</b> {t('palace_direction_stay_end')}
          </div>
        </div>

      </div>
    </>
  );
}
