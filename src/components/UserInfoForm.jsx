import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Calendar, Clock, Compass, MapPin } from 'lucide-react';

export default function UserInfoForm({ userInfo, onChange, onSubmit }) {
  const { t, i18n } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleCategoryClick = (category) => {
    onChange('focus', category);
  };

  const handleGPSDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude.toFixed(2);
          onChange('longitude', longitude);
          alert(`${t('geo_success_alert')} ${longitude}°`);
        },
        (error) => {
          console.error(error);
          alert(t('geo_fail_alert'));
        }
      );
    } else {
      alert(t('geo_fail_alert'));
    }
  };

  const majorCities = [
    { name: '北京 (Beijing)', lng: '116.40' },
    { name: '上海 (Shanghai)', lng: '121.47' },
    { name: '广州 (Guangzhou)', lng: '113.26' },
    { name: '成都 (Chengdu)', lng: '104.06' },
    { name: '西安 (Xi\'an)', lng: '108.94' },
    { name: '乌鲁木齐 (Urumqi)', lng: '87.61' },
    { name: '台北 (Taipei)', lng: '121.56' },
    { name: '纽约 (New York)', lng: '-74.00' },
    { name: '伦敦 (London)', lng: '-0.12' },
    { name: '东京 (Tokyo)', lng: '139.69' },
    { name: '悉尼 (Sydney)', lng: '151.20' }
  ];

  const getDoubleHours = () => {
    const isEn = i18n.language === 'en';
    const isTc = i18n.language === 'tc';

    return [
      { val: 0, label: isEn ? 'Zi Hour (23:00 - 01:00)' : isTc ? '子時 (23:00 - 01:00)' : '子时 (23:00 - 01:00)' },
      { val: 1, label: isEn ? 'Chou Hour (01:00 - 03:00)' : isTc ? '醜時 (01:00 - 03:00)' : '丑时 (01:00 - 03:00)' },
      { val: 3, label: isEn ? 'Yin Hour (03:00 - 05:00)' : isTc ? '寅時 (03:00 - 05:00)' : '寅时 (03:00 - 05:00)' },
      { val: 5, label: isEn ? 'Mao Hour (05:00 - 07:00)' : isTc ? '卯時 (05:00 - 07:00)' : '卯时 (05:00 - 07:00)' },
      { val: 7, label: isEn ? 'Chen Hour (07:00 - 09:00)' : isTc ? '辰時 (07:00 - 09:00)' : '辰时 (07:00 - 09:00)' },
      { val: 9, label: isEn ? 'Si Hour (09:00 - 11:00)' : isTc ? '巳時 (09:00 - 11:00)' : '巳时 (09:00 - 11:00)' },
      { val: 11, label: isEn ? 'Wu Hour (11:00 - 13:00)' : isTc ? '午時 (11:00 - 13:00)' : '午时 (11:00 - 13:00)' },
      { val: 13, label: isEn ? 'Wei Hour (13:00 - 15:00)' : isTc ? '未時 (13:00 - 15:00)' : '未时 (13:00 - 15:00)' },
      { val: 15, label: isEn ? 'Shen Hour (15:00 - 17:00)' : isTc ? '申時 (15:00 - 17:00)' : '申时 (15:00 - 17:00)' },
      { val: 17, label: isEn ? 'You Hour (17:00 - 19:00)' : isTc ? '酉時 (17:00 - 19:00)' : '酉时 (17:00 - 19:00)' },
      { val: 19, label: isEn ? 'Xu Hour (19:00 - 21:00)' : isTc ? '戌時 (19:00 - 21:00)' : '戌时 (19:00 - 21:00)' },
      { val: 21, label: isEn ? 'Hai Hour (21:00 - 23:00)' : isTc ? '亥時 (21:00 - 23:00)' : '亥时 (21:00 - 23:00)' }
    ];
  };

  return (
    <div className="glass-panel form-panel">
      <h3 style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '10px', color: '#f3e5ab', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass size={18} style={{ color: '#d4af37' }} />
        {t('form_title')}
      </h3>
      
      <div className="form-group">
        <label className="form-label">
          <User size={14} style={{ color: '#d4af37' }} /> {t('form_name')}
        </label>
        <input
          type="text"
          name="name"
          className="form-input"
          placeholder={t('form_name_placeholder')}
          value={userInfo.name}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('form_gender')}</label>
        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="radio"
              name="gender"
              value="男"
              checked={userInfo.gender === '男'}
              onChange={handleInputChange}
              style={{ accentColor: '#d4af37' }}
            /> {t('form_male')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="radio"
              name="gender"
              value="女"
              checked={userInfo.gender === '女'}
              onChange={handleInputChange}
              style={{ accentColor: '#d4af37' }}
            /> {t('form_female')}
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <Calendar size={14} style={{ color: '#d4af37' }} /> {t('form_birth_date')}
        </label>
        <input
          type="date"
          name="birthDate"
          className="form-input"
          value={userInfo.birthDate}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <Clock size={14} style={{ color: '#d4af37' }} /> {t('form_birth_hour')}
        </label>
        <select
          name="birthHour"
          className="form-select"
          value={userInfo.birthHour}
          onChange={handleInputChange}
        >
          {getDoubleHours().map((h) => (
            <option key={h.val} value={h.val}>
              {h.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} style={{ color: '#d4af37' }} /> {t('form_longitude')}
          </span>
          <button 
            type="button" 
            onClick={handleGPSDetect} 
            className="btn-outline-cyan" 
            style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--accent-cyan)' }}
          >
            {t('geo_detect_btn')}
          </button>
        </label>
        
        {/* City Presets Select */}
        <select 
          className="form-select" 
          onChange={(e) => e.target.value && onChange('longitude', e.target.value)}
          defaultValue=""
          style={{ fontSize: '0.8rem', padding: '6px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'var(--text-light)', borderRadius: '8px', cursor: 'pointer' }}
        >
          <option value="">-- {t('geo_preset_label')} --</option>
          {majorCities.map(c => (
            <option key={c.name} value={c.lng}>{c.name} ({c.lng}°)</option>
          ))}
        </select>

        {/* Longitude Input */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
          <input
            type="number"
            step="0.01"
            name="longitude"
            className="form-input"
            placeholder="120.0"
            value={userInfo.longitude || '120.0'}
            onChange={handleInputChange}
            style={{ flexGrow: 1 }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            东经 / Longitude
          </span>
        </div>
      </div>


      <div className="form-group">
        <label className="form-label">
          <Compass size={14} style={{ color: '#d4af37' }} /> {t('form_focus')}
        </label>
        <div className="category-selector">
          <button
            type="button"
            className={`category-btn ${userInfo.focus === 'general' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('general')}
          >
            {t('focus_general')}
          </button>
          <button
            type="button"
            className={`category-btn ${userInfo.focus === 'career' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('career')}
          >
            {t('focus_career')}
          </button>
          <button
            type="button"
            className={`category-btn ${userInfo.focus === 'wealth' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('wealth')}
          >
            {t('focus_wealth')}
          </button>
          <button
            type="button"
            className={`category-btn ${userInfo.focus === 'love' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('love')}
          >
            {t('focus_love')}
          </button>
        </div>
      </div>

      <button onClick={onSubmit} className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        {t('form_submit')}
      </button>
      
      <p style={{ fontSize: '0.7rem', color: '#8892b0', textAlign: 'center', marginTop: '4px' }}>
        {t('form_footer')}
      </p>
    </div>
  );
}
