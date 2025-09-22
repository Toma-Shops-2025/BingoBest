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
      // Create PayPal payment URL
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      const environment = import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox';
      
      if (!clientId) {
        alert('PayPal is not configured. Please contact support.');
        return;
      }

      // Create PayPal payment URL
      const returnUrl = `${window.location.origin}/payment/success`;
      const cancelUrl = `${window.location.origin}/payment/cancel`;
      
      const paypalUrl = `https://www.${environment === 'production' ? '' : 'sandbox.'}paypal.com/checkoutnow?client-id=${clientId}&currency=USD&intent=capture&amount=${paymentAmount.toFixed(2)}&return-url=${encodeURIComponent(returnUrl)}&cancel-url=${encodeURIComponent(cancelUrl)}`;
      
      // Redirect to PayPal
      window.location.href = paypalUrl;
      
    } catch (error) {
      console.error('PayPal payment error:', error);
      alert('PayPal payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Crypto wallet addresses
      const cryptoWallets = {
        bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        litecoin: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        dogecoin: 'D7Y55vJ8qZc4G2Qj8F9vK3mN6pL1sT4wX7yA2bC5eH8',
        usdc: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        usdt: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      };

      // Show crypto payment options
      const cryptoChoice = prompt(
        `Crypto Payment - $${paymentAmount.toFixed(2)}\n\n` +
        `Choose your cryptocurrency:\n` +
        `1. Bitcoin (BTC)\n` +
        `2. Ethereum (ETH)\n` +
        `3. Litecoin (LTC)\n` +
        `4. Dogecoin (DOGE)\n` +
        `5. USD Coin (USDC)\n` +
        `6. Tether (USDT)\n\n` +
        `Enter 1-6 to select:`
      );

      if (!cryptoChoice || cryptoChoice < 1 || cryptoChoice > 6) {
        alert('Invalid selection. Payment cancelled.');
        setIsProcessing(false);
        return;
      }

      const cryptoOptions = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'usdc', 'usdt'];
      const selectedCrypto = cryptoOptions[parseInt(cryptoChoice) - 1];
      const walletAddress = cryptoWallets[selectedCrypto as keyof typeof cryptoWallets];

      // Show payment instructions
      const confirmed = window.confirm(
        `Crypto Payment Instructions\n\n` +
        `Amount: $${paymentAmount.toFixed(2)}\n` +
        `Currency: ${selectedCrypto.toUpperCase()}\n` +
        `Wallet Address: ${walletAddress}\n\n` +
        `Send the equivalent amount in ${selectedCrypto.toUpperCase()} to the address above.\n` +
        `Payment will be confirmed within 10-30 minutes.\n\n` +
        `Click OK to simulate successful payment (for testing)`
      );
      
      if (confirmed) {
        const paymentId = `CRYPTO_${selectedCrypto.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
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
