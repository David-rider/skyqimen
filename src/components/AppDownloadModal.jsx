import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Smartphone, Laptop, Download, Info } from 'lucide-react';

export default function AppDownloadModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  // Catch the PWA install prompt in browser
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handlePWAInstall = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        }
        setInstallPromptEvent(null);
      });
    } else {
      alert(i18n.language === 'en' 
        ? "Desktop installation support: Please tap the 'Install App' icon on your browser's address bar directly (usually next to the bookmark star icon)."
        : "桌面版安装提示：请直接点击浏览器地址栏右侧的「安装应用」图标（通常位于收藏夹星星图标旁边）。"
      );
    }
  };

  const handleAPKDownload = () => {
    alert(i18n.language === 'en'
      ? "Android Build Environment Ready!\n\nThe native Android source code is fully generated in the project's '/android' folder.\n\nSteps to compile:\n1. Run 'npm run build:android' to compile web code & sync files.\n2. Open the '/android' folder in Android Studio.\n3. Click 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)' to generate the real, runnable Android installation package (.apk)!"
      : "安卓原生包编译环境已生成！\n\n原生 Android 项目源代码已生成在项目目录的 '/android' 文件夹中。\n\n如何打包出可用 App：\n1. 在项目根目录运行：npm run build:android 编译网页并同步至原生文件夹。\n2. 用 Android Studio 打开项目中的 '/android' 子目录。\n3. 在顶部菜单点击 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)' 即可瞬间生成实际可安装运行的 APK 安卓包！"
    );
  };


  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '28px' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--accent-gold)', fontSize: '1.4rem', marginBottom: '8px' }}>
            {t('download_title')}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t('download_subtitle')}
          </p>
        </div>

        {/* Content Body: Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="download-grid-layout">
          
          <style>{`
            .download-grid-layout {
              grid-template-columns: 1fr;
            }
            @media (min-width: 576px) {
              .download-grid-layout {
                grid-template-columns: 1.2fr 1fr;
              }
            }
          `}</style>

          {/* Left Column: Interactive Guides & Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={16} /> iOS / Android {t('download_step_title')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.75rem', lineHeight: '1.5' }}>
                <div>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>Android 安卓版:</span>
                  <p style={{ color: 'var(--text-light)', marginTop: '2px', whiteSpace: 'pre-line' }}>{t('download_step_android')}</p>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>iOS 苹果版:</span>
                  <p style={{ color: 'var(--text-light)', marginTop: '2px', whiteSpace: 'pre-line' }}>{t('download_step_ios')}</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={handleAPKDownload} 
                className="btn-gold" 
                style={{ justifyContent: 'center', padding: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
              >
                <Download size={14} />
                {t('download_android_btn')}
              </button>
              
              <button 
                onClick={handlePWAInstall} 
                className="btn-outline-cyan" 
                style={{ justifyContent: 'center', padding: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
              >
                <Laptop size={14} />
                {t('download_desktop_btn')}
              </button>
            </div>

          </div>

          {/* Right Column: Mystical YinYang QR Code Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '16px', padding: '20px' }}>
            
            {/* Yin-Yang centered QR Code Mockup in SVG */}
            <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)', position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* QR Code Grid Details in SVG */}
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                {/* 3 Large Corner Position Detection Marks */}
                <rect x="0" y="0" width="25" height="25" fill="#0e0c1f" />
                <rect x="3.5" y="3.5" width="18" height="18" fill="#fff" />
                <rect x="7" y="7" width="11" height="11" fill="#0e0c1f" />
                
                <rect x="75" y="0" width="25" height="25" fill="#0e0c1f" />
                <rect x="78.5" y="3.5" width="18" height="18" fill="#fff" />
                <rect x="82" y="7" width="11" height="11" fill="#0e0c1f" />
                
                <rect x="0" y="75" width="25" height="25" fill="#0e0c1f" />
                <rect x="3.5" y="78.5" width="18" height="18" fill="#fff" />
                <rect x="7" y="82" width="11" height="11" fill="#0e0c1f" />
                
                {/* Grid Dots */}
                <path d="M30,0 h5 v5 h-5 z M40,0 h5 v5 h-5 z M50,0 h5 v5 h-5 z M60,0 h5 v5 h-5 z M70,0 h5 v5 h-5 z
                         M30,10 h5 v5 h-5 z M45,10 h10 v5 h-10 z M65,10 h5 v5 h-5 z
                         M35,20 h10 v5 h-10 z M55,20 h15 v5 h-15 z
                         M0,30 h10 v5 h-10 z M20,30 h15 v5 h-15 z M45,30 h10 v5 h-10 z M65,30 h15 v5 h-15 z M90,30 h10 v5 h-10 z
                         M10,40 h15 v5 h-15 z M35,40 h5 v5 h-5 z M50,40 h20 v5 h-20 z M80,40 h15 v5 h-15 z
                         M0,50 h25 v5 h-25 z M30,50 h10 v5 h-10 z M55,50 h15 v5 h-15 z M75,50 h20 v5 h-20 z
                         M10,60 h5 v5 h-5 z M25,60 h15 v5 h-15 z M50,60 h10 v5 h-10 z M70,60 h10 v5 h-10 z M90,60 h5 v5 h-5 z
                         M30,70 h20 v5 h-20 z M60,70 h15 v5 h-15 z M85,70 h10 v5 h-10 z
                         M30,80 h15 v5 h-15 z M55,80 h10 v5 h-10 z M75,80 h20 v5 h-20 z
                         M35,90 h15 v5 h-15 z M60,90 h10 v5 h-10 z M80,90 h15 v5 h-15 z" 
                      fill="#0e0c1f" />
                
                {/* Metaphysical Yin-Yang (Taiji) Emblem in Center */}
                <circle cx="50" cy="50" r="18" fill="#fff" />
                <circle cx="50" cy="50" r="14" fill="#0e0c1f" />
                <path d="M50,36 A7,7 0 0,0 50,50 A7,7 0 0,1 50,64 A14,14 0 0,0 50,36" fill="#fff" />
                <circle cx="50" cy="43" r="2.5" fill="#0e0c1f" />
                <circle cx="50" cy="57" r="2.5" fill="#fff" />
              </svg>

            </div>

            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold-light)', textAlign: 'center', lineHeight: '1.4', padding: '0 8px' }}>
              {t('download_qr_tip')}
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}
