import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Coins, DollarSign } from 'lucide-react';

interface SimplePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: string, transactionId: string) => void;
}

const SimplePaymentModal: React.FC<SimplePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess
}) => {
  const [paymentAmount, setPaymentAmount] = useState(amount);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simple PayPal simulation
      const paymentId = `PP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Show confirmation
      const confirmed = window.confirm(
        `PayPal Payment\n\nAmount: $${paymentAmount.toFixed(2)}\n\nClick OK to confirm payment`
      );
      
      if (confirmed) {
        // Process payment
        onPaymentSuccess('paypal', paymentId);
        
        // Close modal immediately
        onClose();
        
        // Show success message
        alert(`Payment successful! Added $${paymentAmount.toFixed(2)} to your balance.`);
      } else {
        alert('Payment cancelled.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    
    try {
      const paymentId = `CRYPTO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Show crypto instructions
      const confirmed = window.confirm(
        `Crypto Payment\n\nAmount: $${paymentAmount.toFixed(2)}\n\nThis is a simulation. In real implementation, you would send crypto to the provided address.\n\nClick OK to simulate successful payment`
      );
      
      if (confirmed) {
        // Process payment
        onPaymentSuccess('crypto', paymentId);
        
        // Close modal immediately
        onClose();
        
        // Show success message
        alert(`Payment successful! Added $${paymentAmount.toFixed(2)} to your balance.`);
      } else {
        alert('Payment cancelled.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
              onClick={handlePayPalPayment}
              disabled={isProcessing || paymentAmount < 1}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : `Pay $${paymentAmount.toFixed(2)} with PayPal`}
            </Button>

            <Button
              onClick={handleCryptoPayment}
              disabled={isProcessing || paymentAmount < 1}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Coins className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : `Pay $${paymentAmount.toFixed(2)} with Crypto`}
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

export default SimplePaymentModal;
