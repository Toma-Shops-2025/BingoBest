import React from 'react';
import CryptoPaymentModal from './CryptoPaymentModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentSuccess 
}) => {
  return (
    <CryptoPaymentModal
      isOpen={isOpen}
      onClose={onClose}
      amount={amount}
      onPaymentSuccess={onPaymentSuccess}
    />
  );
};

export default PaymentModal;