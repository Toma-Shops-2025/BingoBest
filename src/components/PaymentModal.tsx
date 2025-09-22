import React from 'react';
import DirectPaymentModal from './DirectPaymentModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: string, transactionId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentSuccess 
}) => {
  return (
    <DirectPaymentModal
      isOpen={isOpen}
      onClose={onClose}
      amount={amount}
      onPaymentSuccess={onPaymentSuccess}
    />
  );
};

export default PaymentModal;