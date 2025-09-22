import React from 'react';
import InstantPaymentModal from './InstantPaymentModal';

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
    <InstantPaymentModal
      isOpen={isOpen}
      onClose={onClose}
      amount={amount}
      onPaymentSuccess={onPaymentSuccess}
    />
  );
};

export default PaymentModal;