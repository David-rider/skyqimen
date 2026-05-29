import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Sparkles, Key, HelpCircle, Coins, ChevronRight, Globe, Smartphone, User } from 'lucide-react';

import UserInfoForm from './components/UserInfoForm';
import QiMenBoard from './components/QiMenBoard';
import ForecastReport from './components/ForecastReport';
import AIConsultant from './components/AIConsultant';
import PalaceDetailPanel from './components/PalaceDetailPanel';
import SubscriptionModal from './components/SubscriptionModal';
import SettingsModal from './components/SettingsModal';
import StarryCanvas from './components/StarryCanvas';
import ExportCardModal from './components/ExportCardModal';
import AppDownloadModal from './components/AppDownloadModal';
import SEOEncyclopedia from './components/SEOEncyclopedia';
import AuthModal from './components/AuthModal';
import HistoryModal from './components/HistoryModal';

import { generateQiMenChartPro, evaluateQiMenChartPro, getUserPersonalForecastPro } from './utils/qimen';
import { askCelestialMentor } from './utils/gemini';

const INITIAL_USER_INFO = {
  name: '张有缘',
  gender: '男',
  birthDate: '1996-05-18',
  birthHour: 9, // 巳时
  longitude: '120.0', // default longitude
  focus: 'general'
};

export default function App() {
  const { t, i18n } = useTranslation();

  // --- STATE ---
  const [userInfo, setUserInfo] = useState(INITIAL_USER_INFO);
  const [chart, setChart] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [forecast, setForecast] = useState(null);
  
  // Chat state
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  
  // Settings & Premium State
  const [apiKey, setApiKey] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [freeQueriesLeft, setFreeQueriesLeft] = useState(3);
  
  // UI Interactive State
  const [activePalaceId, setActivePalaceId] = useState(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportCardOpen, setIsExportCardOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Secure Database Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

  // --- INITIAL MOUNT ---
  useEffect(() => {
    // 1. Verify user JWT token silently from backend database
    const token = localStorage.getItem('qimen_auth_token');
    if (token) {
      fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Token expired');
      })
      .then(data => {
        setCurrentUser(data.user);
        setIsPremium(data.user.role !== 'free');
        if (data.user.apiKey) {
          setApiKey(data.user.apiKey);
          localStorage.setItem('qimen_gemini_key', data.user.apiKey);
        }
        setFreeQueriesLeft(data.user.free_queries_left);
        // Silent load history list
        fetchHistoryList();
      })
      .catch(err => {
        console.warn('Silent token verify failed:', err.message);
        localStorage.removeItem('qimen_auth_token');
      });
    } else {
      // Load local storage guest states
      const savedKey = localStorage.getItem('qimen_gemini_key') || '';
      const savedPremium = localStorage.getItem('qimen_premium_status') === 'true';
      const savedQueries = localStorage.getItem('qimen_queries_left');
      
      setApiKey(savedKey);
      setIsPremium(savedPremium);
      if (savedQueries !== null) {
        setFreeQueriesLeft(parseInt(savedQueries));
      }
    }
    
    // Initial run with default info
    runDivination(INITIAL_USER_INFO);
  }, []);

  const fetchHistoryList = async () => {
    const token = localStorage.getItem('qimen_auth_token');
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/divination/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistoryList(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleDeleteHistory = async (id) => {
    const token = localStorage.getItem('qimen_auth_token');
    if (!token) return;
    if (!window.confirm(i18n.language === 'en' ? 'Are you sure you want to delete this record?' : '确定要删除这条预测记录吗？')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/divination/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setHistoryList(prev => prev.filter(item => item.id !== id));
      } else {
        alert(i18n.language === 'en' ? 'Failed to delete record' : '删除记录失败');
      }
    } catch (err) {
      console.error('Error deleting history:', err);
    }
  };

  const handleLoadHistory = (item) => {
    const info = {
      name: item.name,
      gender: item.gender,
      birthDate: item.birth_date,
      birthHour: item.birth_hour,
      longitude: item.longitude,
      focus: item.focus
    };
    setUserInfo(info);
    setChart(item.chartJson);
    
    const computedEval = evaluateQiMenChartPro(item.chartJson, info.focus);
    const computedForecast = getUserPersonalForecastPro(info, 'daily');
    const weeklyForecast = getUserPersonalForecastPro(info, 'weekly');
    const monthlyForecast = getUserPersonalForecastPro(info, 'monthly');
    const combinedForecast = {
      ...computedForecast,
      weeklySummary: weeklyForecast.weeklySummary,
      weeklyData: weeklyForecast.weeklyData,
      monthlySummary: monthlyForecast.monthlySummary,
      monthlyWeeks: monthlyForecast.monthlyWeeks
    };
    
    setEvaluation(computedEval);
    setForecast(combinedForecast);
    setActivePalaceId(null);
    
    const userStem = combinedForecast.userPillars.day[0];
    const categoryName = t('focus_' + info.focus);
    const translatedJu = getJuLabel(item.chartJson.ju.name);
    
    const greetingText = t('ai_greeting', {
      name: info.name,
      userStem: t('stem_' + userStem),
      juName: translatedJu,
      categoryName,
      overallScore: computedEval.overallScore
    });

    setChatHistory([{ sender: 'ai', text: greetingText }]);
  };

  const handleAuthSuccess = (token, user) => {
    localStorage.setItem('qimen_auth_token', token);
    setCurrentUser(user);
    setIsPremium(user.role !== 'free');
    if (user.apiKey) {
      setApiKey(user.apiKey);
      localStorage.setItem('qimen_gemini_key', user.apiKey);
    }
    setFreeQueriesLeft(user.free_queries_left || user.freeQueriesLeft || 3);
    setTimeout(() => {
      fetchHistoryList();
    }, 50);
  };

  const handleLogout = () => {
    localStorage.removeItem('qimen_auth_token');
    setCurrentUser(null);
    setIsPremium(false);
    setApiKey('');
    localStorage.removeItem('qimen_gemini_key');
    setFreeQueriesLeft(3);
    setHistoryList([]);
    alert(i18n.language === 'en' ? "Successfully logged out. Switched back to guest mode." : "已成功退出登录。已切换回离线临时模式。");
  };

  // Handle click-away to close language dropdown
  useEffect(() => {
    if (!langDropdownOpen) return;
    const closeDropdown = () => setLangDropdownOpen(false);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, [langDropdownOpen]);

  // Re-localize greeting message if language changes
  useEffect(() => {
    if (chatHistory.length > 0 && chart && evaluation && forecast) {
      setChatHistory(prev => {
        if (prev.length === 0) return prev;
        const newHistory = [...prev];
        const userStem = forecast.userPillars.day[0];
        const categoryName = t('focus_' + userInfo.focus);
        const translatedJu = getJuLabel(chart.ju.name);
        
        const greetingText = t('ai_greeting', {
          name: userInfo.name,
          userStem: t('stem_' + userStem),
          juName: translatedJu,
          categoryName,
          overallScore: evaluation.overallScore
        });
        
        newHistory[0] = { ...newHistory[0], text: greetingText };
        return newHistory;
      });
    }
  }, [i18n.language]);

  // --- ACTIONS ---
  const runDivination = (info) => {
    const today = new Date();
    
    // 1. Generate full Qi Men Chart
    const computedChart = generateQiMenChartPro(today, info.longitude || '120.0');
    
    // 2. Evaluate palaces and directions
    const computedEval = evaluateQiMenChartPro(computedChart, info.focus);
    
    // 3. Generate personalized forecasts (Daily, Weekly, Monthly)
    const computedForecast = getUserPersonalForecastPro(info, 'daily');
    
    // Merge weekly and monthly lists into one main forecast object
    const weeklyForecast = getUserPersonalForecastPro(info, 'weekly');
    const monthlyForecast = getUserPersonalForecastPro(info, 'monthly');
    
    const combinedForecast = {
      ...computedForecast,
      weeklySummary: weeklyForecast.weeklySummary,
      weeklyData: weeklyForecast.weeklyData,
      monthlySummary: monthlyForecast.monthlySummary,
      monthlyWeeks: monthlyForecast.monthlyWeeks
    };

    // Update States
    setChart(computedChart);
    setEvaluation(computedEval);
    setForecast(combinedForecast);
    setActivePalaceId(null); // close detail panel on recalculation

    // Create introductory AI message based on chart details
    const userStem = combinedForecast.userPillars.day[0];
    const categoryName = t('focus_' + info.focus);
    const translatedJu = getJuLabel(computedChart.ju.name);
    
    const greetingText = t('ai_greeting', {
      name: info.name,
      userStem: t('stem_' + userStem),
      juName: translatedJu,
      categoryName,
      overallScore: computedEval.overallScore
    });

    setChatHistory([{ sender: 'ai', text: greetingText }]);

    // 4. Save history to database if logged in
    const token = localStorage.getItem('qimen_auth_token');
    if (token) {
      fetch('http://localhost:5000/api/divination/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: info.name,
          gender: info.gender,
          birthDate: info.birthDate,
          birthHour: info.birthHour,
          longitude: info.longitude,
          focus: info.focus,
          chartJson: computedChart
        })
      })
      .then(res => {
        if (res.ok) {
          fetchHistoryList();
        }
      })
      .catch(err => console.error('Error saving history:', err));
    }
  };

  const handleInfoChange = (name, value) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    runDivination(userInfo);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('qimen_gemini_key', key);
  };

  const handleUpgradeSuccess = (newRole) => {
    setIsPremium(newRole !== 'free');
    localStorage.setItem('qimen_premium_status', newRole !== 'free' ? 'true' : 'false');
    if (currentUser) {
      setCurrentUser(prev => ({
        ...prev,
        role: newRole
      }));
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || isSending) return;

    // 1. Append user message
    const updatedHistory = [...chatHistory, { sender: 'user', text }];
    setChatHistory(updatedHistory);
    setIsSending(true);

    try {
      // 2. Call Celestial AI
      const aiResponse = await askCelestialMentor(chart, userInfo, updatedHistory, apiKey);
      
      // 3. Append AI reply
      setChatHistory(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      
      // 4. Update usage limits
      if (!isPremium) {
        if (currentUser) {
          try {
            const token = localStorage.getItem('qimen_auth_token');
            const res = await fetch('http://localhost:5000/api/divination/use-query', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setFreeQueriesLeft(data.freeQueriesLeft);
              setCurrentUser(prev => ({
                ...prev,
                free_queries_left: data.freeQueriesLeft
              }));
            }
          } catch (err) {
            console.error('Failed to decrement query balance in DB:', err);
          }
        } else {
          const nextQueries = Math.max(0, freeQueriesLeft - 1);
          setFreeQueriesLeft(nextQueries);
          localStorage.setItem('qimen_queries_left', nextQueries.toString());
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { sender: 'ai', text: t('ai_error') }]);
    } finally {
      setIsSending(false);
    }
  };

  // Reset queries left to 3 (Demo utility)
  const handleResetDemoQueries = () => {
    setFreeQueriesLeft(3);
    localStorage.setItem('qimen_queries_left', '3');
    alert(t('alert_reset_demo'));
  };

  const handleLogoutSubscription = () => {
    setIsPremium(false);
    localStorage.setItem('qimen_premium_status', 'false');
    alert(t('alert_logout_sub'));
  };

  if (!chart || !evaluation || !forecast) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px', color: 'var(--accent-gold)' }}>
        <svg className="logo-bagua" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '64px', height: '64px' }}>
          <circle cx="50" cy="50" r="45" stroke="#d4af37" strokeWidth="3" strokeDasharray="8 4"/>
          <path d="M50 5A45 45 0 0 1 50 95A45 45 0 0 1 50 5" stroke="#d4af37" strokeWidth="2"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-mystic)' }}>{t('loading_chart')}</span>
      </div>
    );
  }

  const toggleLangDropdown = (e) => {
    e.stopPropagation();
    setLangDropdownOpen(!langDropdownOpen);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('qimen_i18n_lang', lang);
    setLangDropdownOpen(false);
  };

  return (
    <>
      {/* 1. TOP NAVBAR */}
      <nav className="mystic-nav">
        <div className="logo-container">
          <svg className="logo-bagua" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#d4af37" strokeWidth="3" strokeDasharray="8 4"/>
            <path d="M50 5A45 45 0 0 1 50 95A45 45 0 0 1 50 5" stroke="#d4af37" strokeWidth="2"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="#d4af37" strokeWidth="1"/>
          </svg>
          <span className="logo-text">{t('title')}</span>
        </div>

        <div className="nav-actions">
          {/* Language Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={toggleLangDropdown} 
              className="btn-outline-cyan" 
              style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe size={12} />
              {i18n.language === 'en' ? 'English' : i18n.language === 'tc' ? '繁體中文' : '简体中文'}
            </button>
            {langDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--bg-deep)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 8px var(--accent-cyan-glow)',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '120px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <button 
                  onClick={() => handleLanguageChange('zh')} 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: i18n.language === 'zh' ? 'var(--accent-cyan)' : 'var(--text-light)',
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    display: 'block',
                    width: '100%'
                  }}
                  className="lang-opt"
                >
                  简体中文
                </button>
                <button 
                  onClick={() => handleLanguageChange('tc')} 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: i18n.language === 'tc' ? 'var(--accent-cyan)' : 'var(--text-light)',
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    display: 'block',
                    width: '100%'
                  }}
                  className="lang-opt"
                >
                  繁體中文
                </button>
                <button 
                  onClick={() => handleLanguageChange('en')} 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: i18n.language === 'en' ? 'var(--accent-cyan)' : 'var(--text-light)',
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    display: 'block',
                    width: '100%'
                  }}
                  className="lang-opt"
                >
                  English
                </button>
              </div>
            )}
          </div>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <User size={12} style={{ color: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-white)' }}>{currentUser.username}</span>
                {currentUser.role === 'vip' ? (
                  <span className="badge-vip" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>VIP</span>
                ) : currentUser.role === 'pro' ? (
                  <span className="badge-vip" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{t('nav_pro')}</span>
                ) : (
                  <span className="badge-free" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{t('nav_free')}</span>
                )}
              </div>
              
              {currentUser.role === 'free' && (
                <button onClick={() => setIsUpgradeOpen(true)} className="btn-gold" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  {t('nav_upgrade')}
                </button>
              )}
              
              <button 
                onClick={() => setIsHistoryOpen(true)} 
                className="btn-outline-cyan" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {i18n.language === 'en' ? 'My History' : i18n.language === 'tc' ? '我的預測' : '我的预测'}
              </button>
              
              <button onClick={handleLogout} className="btn-outline-gold" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                {t('nav_logout')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setIsAuthOpen(true)} className="btn-gold" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                {t('nav_login')}
              </button>
            </div>
          )}
          
          <button onClick={() => setIsDownloadOpen(true)} className="btn-outline-gold" style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Smartphone size={12} />
            {t('nav_download')}
          </button>

          <button onClick={() => setIsSettingsOpen(true)} className="btn-outline-cyan" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Key size={12} style={{ marginRight: '6px' }} />
            {t('nav_api_settings')}
          </button>
        </div>
      </nav>

      {/* 2. BODY CONTENT */}
      <div className="container">
        
        {/* Left Side: Input Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <UserInfoForm
            userInfo={userInfo}
            onChange={handleInfoChange}
            onSubmit={handleFormSubmit}
          />
          
          {/* Pro Benefits Banner */}
          {!isPremium && (
            <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(6, 5, 11, 0.8) 100%)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
                <Coins size={16} />
                <h4 style={{ fontFamily: 'var(--font-mystic)' }}>{t('banner_title')}</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('banner_desc')}
              </p>
              <button 
                onClick={() => setIsUpgradeOpen(true)}
                className="btn-outline-gold" 
                style={{ fontSize: '0.75rem', padding: '6px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                {t('banner_btn')} <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Board and AI interpretation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Qi Men 3x3 Grid Board */}
          <QiMenBoard
            chart={chart}
            activePalaceId={activePalaceId}
            onPalaceSelect={setActivePalaceId}
            onExportCard={() => setIsExportCardOpen(true)}
          />

          {/* Daily/Weekly/Monthly Forecast Report */}
          <ForecastReport
            forecast={forecast}
            isPremium={isPremium}
            onOpenUpgrade={() => setIsUpgradeOpen(true)}
          />

          {/* AI Advisor Chat Container */}
          <AIConsultant
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            isSending={isSending}
            isPremium={isPremium}
            freeQueriesLeft={freeQueriesLeft}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenUpgrade={() => setIsUpgradeOpen(true)}
          />

        </div>
      </div>

      {/* SEO Knowledge Base */}
      <div style={{ maxWidth: '1300px', margin: '32px auto 0 auto', padding: '0 20px' }}>
        <SEOEncyclopedia />
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', padding: '24px 0', marginTop: '48px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>{t('footer_copy')}</p>
        <p style={{ marginTop: '6px', fontSize: '0.7rem' }}>{t('footer_disclaimer')}</p>
      </footer>


      {/* 3. MODALS AND DETAILS PANEL */}
      
      {/* Palace Slide-over Detail Panel */}
      <PalaceDetailPanel
        palaceId={activePalaceId}
        chart={chart}
        evaluation={evaluation}
        onClose={() => setActivePalaceId(null)}
      />

      {/* Subscription Pricing and Payment Simulator Modal */}
      <SubscriptionModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Database User Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Divination History List Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onSelectHistory={handleLoadHistory}
        onDeleteHistory={handleDeleteHistory}
      />

      {/* Settings API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Export Share Card Modal */}
      <ExportCardModal
        isOpen={isExportCardOpen}
        onClose={() => setIsExportCardOpen(false)}
        chart={chart}
        evaluation={evaluation}
        forecast={forecast}
        userInfo={userInfo}
      />
      <AppDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
      <StarryCanvas />
    </>
  );
}
