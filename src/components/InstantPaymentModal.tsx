import React, { useState } from 'react';

interface InstantPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: string, transactionId: string) => void;
}

const InstantPaymentModal: React.FC<InstantPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess
}) => {
  const [paymentAmount, setPaymentAmount] = useState(amount);

  if (!isOpen) return null;

  const handlePayment = (method: string) => {
    const paymentId = `${method.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Process payment immediately - no delays, no processing states
    onPaymentSuccess(method, paymentId);
    onClose();
    
    // Show success message
    setTimeout(() => {
      alert(`Payment successful! Added $${paymentAmount.toFixed(2)} to your balance via ${method.toUpperCase()}.`);
    }, 100);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>💳 Add Funds</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Amount (USD)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#333' }}>$</span>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                width: '100px',
                color: '#333',
                backgroundColor: 'white'
              }}
              min="1"
              max="1000"
              step="0.01"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => handlePayment('paypal')}
            disabled={paymentAmount < 1}
            style={{
              padding: '12px',
              backgroundColor: paymentAmount < 1 ? '#ccc' : '#0070ba',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: paymentAmount < 1 ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            Pay ${paymentAmount.toFixed(2)} with PayPal
          </button>

          <button
            onClick={() => handlePayment('crypto')}
            disabled={paymentAmount < 1}
            style={{
              padding: '12px',
              backgroundColor: paymentAmount < 1 ? '#ccc' : '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: paymentAmount < 1 ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            Pay ${paymentAmount.toFixed(2)} with Crypto
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InstantPaymentModal;
