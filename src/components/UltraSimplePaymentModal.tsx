import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UltraSimplePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: string, transactionId: string) => void;
}

const UltraSimplePaymentModal: React.FC<UltraSimplePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess
}) => {
  const [paymentAmount, setPaymentAmount] = useState(amount);

  const handlePayment = (method: string) => {
    // Create payment ID
    const paymentId = `${method.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Process payment immediately
    onPaymentSuccess(method, paymentId);
    
    // Close modal immediately
    onClose();
    
    // Show success message
    alert(`Payment successful! Added $${paymentAmount.toFixed(2)} to your balance via ${method.toUpperCase()}.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            💳 Add Funds
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg">$</span>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                className="text-lg font-bold"
                min="1"
                max="1000"
                step="0.01"
              />
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handlePayment('paypal')}
              disabled={paymentAmount < 1}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Pay ${paymentAmount.toFixed(2)} with PayPal
            </Button>

            <Button
              onClick={() => handlePayment('crypto')}
              disabled={paymentAmount < 1}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Pay ${paymentAmount.toFixed(2)} with Crypto
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UltraSimplePaymentModal;
