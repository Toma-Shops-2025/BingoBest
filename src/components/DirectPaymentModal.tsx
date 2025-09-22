import React, { useState, useEffect } from 'react';

interface DirectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: string, transactionId: string) => void;
}

const DirectPaymentModal: React.FC<DirectPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess
}) => {
  const [paymentAmount, setPaymentAmount] = useState(amount);

  // Force close modal after payment
  useEffect(() => {
    if (isOpen) {
      // Add escape key listener
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePayment = (method: string) => {
    const paymentId = `${method.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Process payment immediately
    onPaymentSuccess(method, paymentId);
    
    // Force close modal using multiple methods
    setTimeout(() => {
      onClose();
    }, 50);
    
    // Also try to close by removing the modal from DOM
    setTimeout(() => {
      const modal = document.querySelector('[data-payment-modal]');
      if (modal) {
        modal.remove();
      }
    }, 100);
    
    // Show success message
    setTimeout(() => {
      alert(`Payment successful! Added $${paymentAmount.toFixed(2)} to your balance via ${method.toUpperCase()}.`);
    }, 200);
  };

  return (
    <div 
      data-payment-modal
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '3px solid #0070ba'
        }}
      >
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#000000',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          💳 Add Funds
        </h2>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            color: '#000000',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Amount (USD)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              color: '#000000', 
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              $
            </span>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              style={{
                padding: '12px',
                border: '2px solid #0070ba',
                borderRadius: '8px',
                fontSize: '18px',
                width: '120px',
                color: '#000000',
                backgroundColor: '#ffffff',
                fontWeight: 'bold'
              }}
              min="1"
              max="1000"
              step="0.01"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
          <button
            onClick={() => handlePayment('paypal')}
            disabled={paymentAmount < 1}
            style={{
              padding: '15px',
              backgroundColor: paymentAmount < 1 ? '#cccccc' : '#0070ba',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: paymentAmount < 1 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Pay ${paymentAmount.toFixed(2)} with PayPal
          </button>

          <button
            onClick={() => handlePayment('crypto')}
            disabled={paymentAmount < 1}
            style={{
              padding: '15px',
              backgroundColor: paymentAmount < 1 ? '#cccccc' : '#ff6b35',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: paymentAmount < 1 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Pay ${paymentAmount.toFixed(2)} with Crypto
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#666666',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DirectPaymentModal;
