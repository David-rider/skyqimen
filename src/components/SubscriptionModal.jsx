import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, CreditCard, Sparkles, Smartphone, Landmark } from 'lucide-react';

export default function SubscriptionModal({ isOpen, onClose, onUpgradeSuccess, currentUser, onOpenAuth }) {
  const { t, i18n } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null); // 'pro' | 'vip'
  const [paymentMethod, setPaymentMethod] = useState('wechat'); // 'wechat' | 'alipay' | 'card'
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  if (!isOpen) return null;

  const handleSelectPlan = async (plan) => {
    if (!currentUser) {
      alert(i18n.language === 'en' ? "Please log in first to upgrade your account!" : "请先登录您的账号再进行订阅升级！");
      onClose();
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setIsProcessing(true);
    try {
      const amount = plan === 'pro' ? 68 : 198;
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('qimen_auth_token')}`
        },
        body: JSON.stringify({
          amount,
          currency: 'CNY',
          platform: paymentMethod
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const data = await response.json();
      setTransactionId(data.order.transactionId);
      setSelectedPlan(plan);
      setShowQR(true);
    } catch (err) {
      alert(i18n.language === 'en' ? 'Checkout initialization failed: ' + err.message : '初始化支付失败: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/payment/confirm-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('qimen_auth_token')}`
        },
        body: JSON.stringify({
          transactionId
        })
      });

      if (!response.ok) {
        throw new Error('Payment confirmation failed');
      }

      const data = await response.json();
      setIsProcessing(false);
      setShowQR(false);
      setSelectedPlan(null);
      onUpgradeSuccess(data.role);
      alert(t('payment_success'));
      onClose();
    } catch (err) {
      alert(i18n.language === 'en' ? 'Payment confirmation error: ' + err.message : '确认付款错误: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: showQR ? '420px' : '900px', padding: '24px' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {!showQR ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--accent-gold)' }}>
                {t('pricing_modal_title')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                {t('pricing_modal_sub')}
              </p>
            </div>

            <div className="pricing-grid">
              {/* Free Plan */}
              <div className="pricing-card">
                <div>
                  <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--text-light)' }}>{t('pricing_free_title')}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('pricing_free_desc')}</p>
                  <div className="price-value">{t('pricing_free_price')} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('pricing_free_period')}</span></div>
                  <ul className="price-list">
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_free_feat1')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_free_feat2')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_free_feat3')}</li>
                  </ul>
                </div>
                <button className="btn-outline-gold" style={{ width: '100%', marginTop: '16px' }} disabled>
                  {t('pricing_free_btn')}
                </button>
              </div>

              {/* Pro Plan */}
              <div className="pricing-card pricing-featured">
                <div style={{ width: '100%' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.65rem', width: 'fit-content', margin: '0 auto 8px auto', fontWeight: 800 }}>
                    {t('pricing_featured')}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--accent-gold-light)' }}>{t('pricing_pro_title')}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('pricing_pro_desc')}</p>
                  <div className="price-value">{t('pricing_pro_price')} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('pricing_pro_period')}</span></div>
                  <ul className="price-list">
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_pro_feat1')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_pro_feat2')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_pro_feat3')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_pro_feat4')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_pro_feat5')}</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleSelectPlan('pro')} 
                  className="btn-gold" 
                  style={{ width: '100%', marginTop: '16px', animation: 'pulse 2s infinite', justifyContent: 'center' }}
                >
                  {t('pricing_pro_btn')}
                </button>
              </div>

              {/* VIP Plan */}
              <div className="pricing-card">
                <div>
                  <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--accent-cyan)' }}>{t('pricing_vip_title')}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('pricing_vip_desc')}</p>
                  <div className="price-value">{t('pricing_vip_price')} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('pricing_vip_period')}</span></div>
                  <ul className="price-list">
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_vip_feat1')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_vip_feat2')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_vip_feat3')}</li>
                    <li><Check size={14} style={{ color: '#00ffcc' }} /> {t('pricing_vip_feat4')}</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleSelectPlan('vip')} 
                  className="btn-outline-cyan" 
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  {t('pricing_vip_btn')}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Payment Simulation screen */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-mystic)', color: 'var(--accent-gold)' }}>
              {t('payment_title')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {t('payment_selected')}: <strong style={{ color: 'var(--text-white)' }}>{selectedPlan === 'pro' ? t('pricing_pro_title') : t('pricing_vip_title')}</strong>
            </p>
            {transactionId && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                订单号 / Order ID: <code style={{ color: 'var(--accent-gold)' }}>{transactionId}</code>
              </p>
            )}

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
              <button 
                type="button" 
                onClick={() => setPaymentMethod('wechat')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                  background: paymentMethod === 'wechat' ? 'rgba(9, 187, 7, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${paymentMethod === 'wechat' ? '#09bb07' : 'rgba(255,255,255,0.1)'}`,
                  color: paymentMethod === 'wechat' ? '#09bb07' : 'var(--text-light)'
                }}
              >
                <Smartphone size={14} /> {t('payment_wechat')}
              </button>
              <button 
                type="button" 
                onClick={() => setPaymentMethod('alipay')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                  background: paymentMethod === 'alipay' ? 'rgba(18, 150, 219, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${paymentMethod === 'alipay' ? '#1296db' : 'rgba(255,255,255,0.1)'}`,
                  color: paymentMethod === 'alipay' ? '#1296db' : 'var(--text-light)'
                }}
              >
                <Smartphone size={14} /> {t('payment_alipay')}
              </button>
              <button 
                type="button" 
                onClick={() => setPaymentMethod('card')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                  background: paymentMethod === 'card' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${paymentMethod === 'card' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
                  color: paymentMethod === 'card' ? 'var(--accent-gold)' : 'var(--text-light)'
                }}
              >
                <CreditCard size={14} /> {t('payment_card')}
              </button>
            </div>

            {/* Glowing Mock QR Code Box */}
            <div style={{
              width: '180px',
              height: '180px',
              border: `2px solid ${paymentMethod === 'wechat' ? '#09bb07' : paymentMethod === 'alipay' ? '#1296db' : 'var(--accent-gold)'}`,
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              padding: '16px',
              boxShadow: '0 0 15px rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', width: '100%', height: '100%', background: '#fff' }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{
                    background: (i * 13 + (paymentMethod === 'wechat' ? 7 : 19)) % 3 === 0 ? '#000' : '#fff',
                    borderRadius: '2px'
                  }} />
                ))}
              </div>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('payment_scan_tip')}
            </p>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
              <button 
                type="button" 
                onClick={() => { setShowQR(false); setSelectedPlan(null); }} 
                className="btn-outline-gold" 
                style={{ flexGrow: 1 }}
                disabled={isProcessing}
              >
                {t('payment_back')}
              </button>
              <button 
                type="button" 
                onClick={handleSimulatePayment} 
                className="btn-gold" 
                style={{ flexGrow: 2, justifyContent: 'center' }}
                disabled={isProcessing}
              >
                {isProcessing ? t('payment_processing') : t('payment_confirm')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
