import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Lock, Calendar, Star, TrendingUp, Compass, Clock, ShieldCheck } from 'lucide-react';

export default function ForecastReport({
  forecast,
  isPremium,
  onOpenUpgrade
}) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('daily');

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

  const luckyDir = forecast.evaluation.luckyDirections[0] || { direction: '中宫', door: '生门' };


  if (!forecast) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--accent-cyan)';
    if (score >= 65) return 'var(--accent-gold)';
    return '#8892b0';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'linear-gradient(90deg, #00b8d4 0%, var(--accent-cyan) 100%)';
    if (score >= 65) return 'linear-gradient(90deg, #b89218 0%, var(--accent-gold) 100%)';
    return 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)';
  };

  const elementColors = {
    '木': '#4bc0c0',
    '火': '#ff6384',
    '土': '#aa88ff',
    '金': '#ffe066',
    '水': '#36a2eb'
  };

  const getElementLabel = (el) => {
    if (i18n.language !== 'en') return el;
    const map = { '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water' };
    return map[el] || el;
  };

  const getPillarName = (val) => {
    if (i18n.language !== 'en') return val;
    return val.split('').map(c => t('stem_' + c) || t('branch_' + c) || c).join('-');
  };

  const getGejuLabel = (name) => {
    if (i18n.language !== 'en') return name;
    const map = {
      '五不遇时': 'Five Unmet Hours (Wu Bu Yu Shi)',
      '星门伏吟': 'Stars & Gates Fu Yin (Stillness)',
      '星门反吟': 'Stars & Gates Fan Yin (Reversal)',
      '飞鸟跌穴': 'Bird Falls into Cave (Fei Niao Die Xue)',
      '青龙返首': 'Green Dragon Returns Head (Qing Long Fan Shou)',
      '腾蛇夭矫': 'Snake Coiling Up (Teng She Yao Jiao)'
    };
    const baseName = name.split(' (')[0];
    const mapped = map[baseName] || name;
    return name.includes(' (在') ? name.replace(baseName, mapped) : mapped;
  };

  const getHourNameLabel = (name) => {
    if (i18n.language !== 'en') return name;
    return name.split('').map(c => t('stem_' + c) || t('branch_' + c) || '').join('-') + ' Hour';
  };
  
  const getHourTimeLabel = (time) => {
    if (i18n.language !== 'en') return time;
    const branchChar = time[0];
    const range = time.match(/\(.*\)/)?.[0] || '';
    return `${t('branch_' + branchChar) || branchChar} ${range}`;
  };

  const getHourStateLabel = (state) => {
    if (i18n.language !== 'en') return state;
    const map = { '吉': 'Auspicious', '次吉': 'Good', '平': 'Neutral', '凶': 'Blocked' };
    return map[state] || state;
  };

  const getHourDetailLabel = (detail, state) => {
    if (i18n.language !== 'en') return detail;
    const map = {
      '吉': 'Auspicious hour. Good for starting plans or signing agreements.',
      '次吉': 'Favorable hour. Suitable for communication and mild progress.',
      '平': 'Neutral hour. Best for routine paperwork and basic tasks.',
      '凶': 'Inauspicious hour. Avoid travel, conflicts, or significant actions.'
    };
    return map[state] || detail;
  };

  const getWeeklySummaryLabel = (score) => {
    if (score >= 85) return t('pricing_free_title') === '免费版' ? '大吉大利，好运临门，宜积极行动。' : 'Highly auspicious day. Pursue your core plans.';
    if (score >= 70) return t('pricing_free_title') === '免费版' ? '运势平顺，贵人帮扶，利于洽谈。' : 'Favorable day. Good for networking and discussions.';
    if (score >= 55) return t('pricing_free_title') === '免费版' ? '运势平淡，宜守旧业，做好细节。' : 'Neutral day. Focus on details and steady work.';
    return t('pricing_free_title') === '免费版' ? '运势阻碍，防小人官非，凡事退避。' : 'Inauspicious day. Low profile recommended.';
  };

  const getDirectionLabel = (dir) => {
    const map = {
      '北': 'N', '西南': 'SW', '东': 'E', '东南': 'SE', '中': 'C', '西北': 'NW', '西': 'W', '东北': 'NE', '南': 'S'
    };
    return i18n.language === 'en' ? map[dir] || dir : dir;
  };

  const getMonthlyAdviceLabel = (idx, focus) => {
    if (i18n.language !== 'en') return forecast.monthlyWeeks[idx].advice;
    const map = {
      career: [
        'Early Month: Career gate meets Sheng. Good opportunities to learn new skills or network.',
        'Mid Month: Adjustment phase. Work silently and review details, avoid conflicts.',
        'Late Mid Month: High auspicious energy. Favorable for promotions or client signups.',
        'Late Month: Minor office politics, protect confidential files, stay focused.'
      ],
      love: [
        'Early Month: Relationship stars shine. Good timing for dating and meeting prospects.',
        'Mid Month: Minor conflicts. Avoid digging up old disputes, give space.',
        'Late Month: Harmony deity active. Favorable for long journeys, engagements.',
        'Late Month: Calm warmth. Family home vibes are highly nourishing.'
      ],
      wealth: [
        'Early Month: Wealth palace matches Sheng. Returns on minor investments or side-gigs.',
        'Mid Month: Spending desires peak. Control budget, avoid impulse shopping.',
        'Late Mid Month: Favorable for contract negotiations and securing contracts.',
        'Late Month: Steady storage. Consolidate your earnings, avoid high leverages.'
      ],
      general: [
        'Early Month: Good start. Align your objectives and do lightweight networking.',
        'Mid Month: Average energy. Keep a low profile and refine internal databases.',
        'Late Month: Auspicious stars converge. Favorable for massive launches.',
        'Late Month: Neutral wind down. Excellent time for rest and body checkups.'
      ]
    };
    return map[focus]?.[idx] || map.general[idx];
  };

  const getMonthlyGuaLabel = (gua) => {
    if (i18n.language !== 'en') return gua;
    const map = {
      '巽宫 (巽为风)': 'Xun Trigram (Wind)',
      '坤宫 (坤为地)': 'Kun Trigram (Earth)',
      '乾宫 (乾为天)': 'Qian Trigram (Heaven)',
      '离宫 (离为火)': 'Li Trigram (Fire)'
    };
    return map[gua] || gua;
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Forecast Tabs */}
      <div className="tab-headers">
        <button
          className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          {t('report_tab_daily')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          {t('report_tab_weekly')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          {t('report_tab_monthly')}
        </button>
      </div>

      {/* 1. DAILY REPORT TAB */}
      {activeTab === 'daily' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div className="rating-section">
              <div className="rating-circle">
                {forecast.evaluation.overallScore}
              </div>
              <div className="rating-meta">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('report_overall_score')}</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-white)' }}>
                  {forecast.period}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--accent-gold)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                {t('report_pillars_relation')}: <strong>{t('deity_值符') === '值符' ? forecast.affinity : i18n.language === 'tc' ? forecast.affinity : 'Cohesive'}</strong>
              </span>
            </div>
          </div>

          {/* Four Pillars Details */}
          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-title">{t('report_pillars_year')}</div>
              <div className="pillar-val">{getPillarName(forecast.chart.pillars.year)}</div>
            </div>
            <div className="pillar-card">
              <div className="pillar-title">{t('report_pillars_month')}</div>
              <div className="pillar-val">{getPillarName(forecast.chart.pillars.month)}</div>
            </div>
            <div className="pillar-card">
              <div className="pillar-title">{t('report_pillars_day')}</div>
              <div className="pillar-val">{getPillarName(forecast.chart.pillars.day)}</div>
            </div>
            <div className="pillar-card">
              <div className="pillar-title">{t('report_pillars_hour')}</div>
              <div className="pillar-val">{getPillarName(forecast.chart.pillars.hour)}</div>
            </div>
          </div>

          {/* Ge Ju Patterns (吉格/凶格) */}
          {forecast.chart.patterns && forecast.chart.patterns.length > 0 && (
            <div>
              <h4 style={{ color: 'var(--accent-gold-light)', marginBottom: '8px', fontSize: '0.9rem' }}>
                {t('report_geju_detected')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {forecast.chart.patterns.map((pat, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    background: pat.type === 'good' ? 'rgba(0, 255, 204, 0.08)' : pat.type === 'bad' ? 'rgba(255, 77, 77, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${pat.type === 'good' ? 'rgba(0, 255, 204, 0.2)' : pat.type === 'bad' ? 'rgba(255, 77, 77, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.8rem'
                  }}>
                    {pat.type === 'good' ? (
                      <ShieldCheck size={16} style={{ color: '#00ffcc', flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <ShieldAlert size={16} style={{ color: 'var(--accent-red)', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <div>
                      <strong style={{ color: pat.type === 'good' ? '#00ffcc' : pat.type === 'bad' ? 'var(--accent-red)' : 'var(--text-white)' }}>
                        {getGejuLabel(pat.name)}
                      </strong>
                      <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                        {i18n.language === 'en' ? 'Spatial structures determining layout limits.' : pat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Five Elements Balance Indicators */}
          {forecast.chart.elementRatio && (
            <div>
              <h4 style={{ color: 'var(--accent-gold-light)', marginBottom: '10px', fontSize: '0.9rem' }}>
                {t('report_elements_ratio')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.keys(forecast.chart.elementRatio).map((element, idx) => {
                  const pct = forecast.chart.elementRatio[element];
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-white)', width: '60px', fontWeight: '600' }}>
                        {getElementLabel(element)} ({pct}%)
                      </span>
                      <div style={{ flexGrow: 1, height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: elementColors[element] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metaphysical Affinity & Feng Shui Advice */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(22, 19, 47, 0.4)', borderLeft: '3px solid var(--accent-gold)', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '4px' }}>{t('report_pillars_desc')}</div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{forecast.affinityDesc}</p>
            </div>
            
            {forecast.luckyTips && (
              <div style={{ background: 'rgba(0, 240, 255, 0.05)', borderLeft: '3px solid var(--accent-cyan)', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '0.9rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '4px' }}>{t('report_fengshui_title')}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>{t('report_fengshui_color')}：<span style={{ color: '#fff', fontWeight: 600 }}>{i18n.language === 'en' ? forecast.luckyTips.color.replace('绿色', 'Green').replace('红色', 'Red').replace('黄色', 'Yellow').replace('白色', 'White').replace('黑色', 'Black') : forecast.luckyTips.color}</span></div>
                  <div>{t('report_fengshui_number')}：<span style={{ color: '#fff', fontWeight: 600 }}>{forecast.luckyTips.number}</span></div>
                  <div>{t('report_fengshui_strategy')}：<span style={{ color: 'var(--text-muted)' }}>{i18n.language === 'en' ? 'Incorporate elements of ' + getElementLabel(forecast.luckyTips.element) + ' into your surroundings.' : forecast.luckyTips.thing}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Scores Breakdown: Career, Wealth, Love, Health */}
          <div>
            <h4 style={{ color: 'var(--accent-gold-light)', marginBottom: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} /> {t('report_indicators')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Career */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>{t('report_ind_career')}</span>
                  <span style={{ color: getScoreColor(forecast.scores.career), fontWeight: 600 }}>{forecast.scores.career}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${forecast.scores.career}%`, background: getProgressColor(forecast.scores.career) }} />
                </div>
              </div>
              {/* Wealth */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>{t('report_ind_wealth')}</span>
                  <span style={{ color: getScoreColor(forecast.scores.wealth), fontWeight: 600 }}>{forecast.scores.wealth}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${forecast.scores.wealth}%`, background: getProgressColor(forecast.scores.wealth) }} />
                </div>
              </div>
              {/* Love */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>{t('report_ind_love')}</span>
                  <span style={{ color: getScoreColor(forecast.scores.love), fontWeight: 600 }}>{forecast.scores.love}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${forecast.scores.love}%`, background: getProgressColor(forecast.scores.love) }} />
                </div>
              </div>
              {/* Health */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>{t('report_ind_health')}</span>
                  <span style={{ color: getScoreColor(forecast.scores.health), fontWeight: 600 }}>{forecast.scores.health}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${forecast.scores.health}%`, background: getProgressColor(forecast.scores.health) }} />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Advice Box */}
          <div style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', background: 'rgba(14, 12, 31, 0.4)' }}>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={18} /> {t('palace_directive')}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
              {i18n.language === 'en' 
                ? `Active Ju is: ${getJuLabel(forecast.chart.ju.name)}. Time rating index is: ${forecast.evaluation.overallScore}.\n\nThe most auspicious direction is: ${getDirectionLabel(luckyDir.direction)} direction. Pursuing spatial activities or making decisions facing this direction aligns you with Chief Deities and Open/Life Gates to maximize business results.`
                : forecast.evaluation.summary}
            </p>
          </div>

          {/* Hourly Forecast */}
          <div className="premium-lock-overlay" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', padding: '16px', background: 'rgba(22, 19, 47, 0.15)' }}>
            {!isPremium && (
              <div className="lock-shield">
                <Lock size={20} style={{ color: 'var(--accent-gold)' }} />
                <h4 className="lock-title">{t('report_lock_title')}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                  {t('report_lock_desc')}
                </p>
                <button onClick={onOpenUpgrade} className="btn-gold" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  {t('report_lock_btn')}
                </button>
              </div>
            )}
            
            <h4 style={{ color: 'var(--accent-gold-light)', fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> {t('report_hours_table')}
            </h4>
            <div className="hourly-container">
              {forecast.hourlyForecast.map((h, i) => (
                <div key={i} className="hour-badge">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-white)', fontWeight: 600 }}>{getHourTimeLabel(h.time)}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{getHourNameLabel(h.name)}</span>
                  <span className={`hour-rating ${
                    h.state === '吉' ? 'rating-gi' : h.state === '次吉' ? 'rating-cgi' : h.state === '凶' ? 'rating-hei' : 'rating-ping'
                  }`}>
                    {getHourStateLabel(h.state)}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2px' }}>
                    {getHourDetailLabel(h.detail, h.state).slice(0, 20)}...
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. WEEKLY REPORT TAB */}
      {activeTab === 'weekly' && (
        <div className="premium-lock-overlay" style={{ minHeight: '350px', padding: '16px' }}>
          {!isPremium && (
            <div className="lock-shield">
              <Lock size={24} style={{ color: 'var(--accent-gold)' }} />
              <h3 className="lock-title">{t('weekly_lock_title')}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '340px' }}>
                {t('weekly_lock_desc')}
              </p>
              <button onClick={onOpenUpgrade} className="btn-gold">
                {t('weekly_lock_btn')}
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ border: '1px solid rgba(212,175,55,0.2)', padding: '16px', borderRadius: '12px', background: 'rgba(22, 19, 47, 0.3)' }}>
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={18} /> {t('weekly_overall')}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {forecast.weeklySummary}
              </p>
            </div>

            <h4 style={{ color: 'var(--accent-gold-light)', fontSize: '0.95rem', margin: '10px 0 2px 0' }}>{t('weekly_daily_dist')}</h4>
            <div className="weekly-list">
              {forecast.weeklyData?.map((day, idx) => (
                <div key={idx} className="weekly-row">
                  <div className="weekly-day-info">
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-white)' }}>
                      {i18n.language === 'en' ? day.dayOfWeek.replace('周', 'Week ') : day.dayOfWeek}
                    </span>
                    <span className="weekly-date">{day.dateStr}</span>
                    <span className="weekly-ganzhi">{getPillarName(day.ganzhi)}</span>
                  </div>
                  
                  <div className="weekly-details">
                    {t('weekly_lucky_dir')}: <strong style={{ color: 'var(--accent-cyan)' }}>{getDirectionLabel(day.luckyDir)}</strong> ({t('door_' + day.luckyDoor)}) | {getWeeklySummaryLabel(day.score)}
                  </div>

                  <span className={`hour-rating ${
                    day.score >= 80 ? 'rating-gi' : day.score >= 65 ? 'rating-cgi' : 'rating-ping'
                  }`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                    {day.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MONTHLY REPORT TAB */}
      {activeTab === 'monthly' && (
        <div className="premium-lock-overlay" style={{ minHeight: '350px', padding: '16px' }}>
          {!isPremium && (
            <div className="lock-shield">
              <Lock size={24} style={{ color: 'var(--accent-gold)' }} />
              <h3 className="lock-title">{t('monthly_lock_title')}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '340px' }}>
                {t('monthly_lock_desc')}
              </p>
              <button onClick={onOpenUpgrade} className="btn-gold">
                {t('monthly_lock_btn')}
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ border: '1px solid rgba(0, 240, 255, 0.2)', padding: '16px', borderRadius: '12px', background: 'rgba(14, 12, 31, 0.5)' }}>
              <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={18} /> {t('monthly_overall')}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {forecast.monthlySummary}
              </p>
            </div>

            <div className="monthly-grid">
              {forecast.monthlyWeeks?.map((w, idx) => (
                <div key={idx} className="month-week-card">
                  <div className="month-week-header">
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
                      {i18n.language === 'en' ? w.week.replace('第', 'Week ').replace('周 (', ' (').replace('上旬', 'Early').replace('中旬', 'Mid').replace('下旬', 'Late').replace('月末', 'End') : w.week}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                      {t('monthly_gua')}: {getMonthlyGuaLabel(w.mainGua)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
                    {getMonthlyAdviceLabel(idx, i18n.language === 'en' ? 'career' : 'general')}
                  </p>
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{t('monthly_energy')}</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{w.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
