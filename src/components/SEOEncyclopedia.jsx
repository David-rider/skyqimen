import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function SEOEncyclopedia() {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  // Inject JSON-LD FAQ Schema for Search Engine crawlers
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": t('faq_q1'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('faq_a1')
          }
        },
        {
          "@type": "Question",
          "name": t('faq_q2'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('faq_a2')
          }
        },
        {
          "@type": "Question",
          "name": t('faq_q3'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('faq_a3')
          }
        },
        {
          "@type": "Question",
          "name": t('faq_q4'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('faq_a4')
          }
        }
      ]
    };

    // WebApplication structured data
    const appSchemaData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": t('title'),
      "applicationCategory": "DemographicAstrologyApplication",
      "operatingSystem": "Android, iOS, Windows, macOS",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CNY"
      },
      "featureList": [
        "True Solar Time Alignment",
        "Interactive 3x3 Qimen Board",
        "AI Metaphysical Counselor Dialogs",
        "Feng Shui Auspicious Directions Calendar"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'jsonld-seo-faq';
    script.innerHTML = JSON.stringify([schemaData, appSchemaData]);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('jsonld-seo-faq');
      if (existing) {
        existing.remove();
      }
    };
  }, [i18n.language]);

  const faqItems = [
    { q: 'faq_q1', a: 'faq_a1' },
    { q: 'faq_q2', a: 'faq_a2' },
    { q: 'faq_q3', a: 'faq_a3' },
    { q: 'faq_q4', a: 'faq_a4' }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(212,175,55,0.15)', paddingBottom: '12px', marginBottom: '20px' }}>
        <BookOpen size={20} style={{ color: 'var(--accent-gold)' }} />
        <div>
          <h3 style={{ color: 'var(--accent-gold-light)', fontSize: '1.25rem' }}>{t('seo_encyclopedia_title')}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('seo_encyclopedia_sub')}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              style={{
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.01)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Question Banner */}
              <div 
                onClick={() => handleToggle(index)}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isOpen ? 'rgba(0, 240, 255, 0.03)' : 'transparent',
                  userSelect: 'none',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HelpCircle size={16} style={{ color: isOpen ? 'var(--accent-cyan)' : 'var(--accent-gold)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isOpen ? 'var(--accent-cyan)' : 'var(--text-white)' }}>
                    {t(item.q)}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp size={16} style={{ color: 'var(--accent-cyan)' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>

              {/* Answer Content */}
              {isOpen && (
                <div 
                  style={{
                    padding: '16px 20px',
                    fontSize: '0.8rem',
                    color: 'var(--text-light)',
                    lineHeight: '1.6',
                    background: 'rgba(0,0,0,0.2)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {t(item.a)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
