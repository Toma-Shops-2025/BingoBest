import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Copy, CheckCircle, CreditCard, Coins, DollarSign } from 'lucide-react';

interface EnhancedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: string, transactionId: string) => void;
}

type PaymentMethod = 'paypal' | 'bitcoin' | 'ethereum' | 'litecoin' | 'dogecoin' | 'usdc' | 'usdt';

const EnhancedPaymentModal: React.FC<EnhancedPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paypal');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState(amount);

  // Crypto wallet addresses
  const cryptoWallets = {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    litecoin: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    dogecoin: 'D7Y55vJ8qZc4G2Qj8F9vK3mN6pL1sT4wX7yA2bC5eH8',
    usdc: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    usdt: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
  };

  // Real-time crypto rates (mock - in production, use real API)
  const cryptoRates = {
    bitcoin: 0.000023, // BTC per USD
    ethereum: 0.00038, // ETH per USD
    litecoin: 0.0034, // LTC per USD
    dogecoin: 0.45, // DOGE per USD
    usdc: 1.0, // 1:1 with USD
    usdt: 1.0 // 1:1 with USD
  };

  const getCryptoAmount = () => {
    if (!selectedMethod || !cryptoRates[selectedMethod as keyof typeof cryptoRates]) return 0;
    return ((amount || 0) * (cryptoRates[selectedMethod as keyof typeof cryptoRates] || 0)).toFixed(8);
  };

  const getWalletAddress = () => {
    if (!selectedMethod || !cryptoWallets[selectedMethod as keyof typeof cryptoWallets]) return '';
    return cryptoWallets[selectedMethod as keyof typeof cryptoWallets];
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    try {
      // For development - simulate PayPal payment
      console.log(`Creating PayPal payment for $${paymentAmount}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock PayPal payment
      const paymentId = `PP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate PayPal redirect
      const confirmPayment = confirm(
        `PayPal Payment Simulation\n\n` +
        `Amount: $${paymentAmount.toFixed(2)}\n` +
        `Payment ID: ${paymentId}\n\n` +
        `Click OK to simulate successful payment\n` +
        `Click Cancel to simulate payment failure`
      );
      
      if (confirmPayment) {
        // Simulate successful payment
        onPaymentSuccess('paypal', paymentId);
        // Close the modal after successful payment
        setTimeout(() => {
          onClose();
        }, 100);
      } else {
        // Simulate failed payment
        alert('Payment cancelled by user.');
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      alert('PayPal payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate crypto payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const txId = `${selectedMethod.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(txId);
      onPaymentSuccess(selectedMethod, txId);
      // Close the modal after successful payment
      onClose();
    } catch (error) {
      console.error('Crypto payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (selectedMethod === 'paypal') {
      handlePayPalPayment();
    } else {
      handleCryptoPayment();
    }
  };

  useEffect(() => {
    if (selectedMethod && cryptoWallets[selectedMethod as keyof typeof cryptoWallets]) {
      setWalletAddress(getWalletAddress());
    }
  }, [selectedMethod]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            💳 Add Funds to Your Account
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="paypal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              PayPal
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Crypto
            </TabsTrigger>
          </TabsList>

          {/* PayPal Payment Tab */}
          <TabsContent value="paypal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  PayPal Payment
                </CardTitle>
                <CardDescription>
                  Secure payment processing through PayPal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-blue-900">Payment Amount</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">$</span>
                        <Input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                          className="text-2xl font-bold text-blue-600 border-none bg-transparent p-0 w-24"
                          min="1"
                          max="1000"
                          step="0.01"
                        />
                        <span className="text-2xl font-bold text-blue-600">USD</span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">PayPal</span>
                    <Badge variant="secondary">Secure</Badge>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    ✅ <strong>Instant Processing</strong> - Funds added immediately
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    ✅ <strong>Secure & Protected</strong> - PayPal buyer protection
                  </p>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ${paymentAmount.toFixed(2)} with PayPal
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crypto Payment Tab */}
          <TabsContent value="crypto" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Cryptocurrency Payment
                </CardTitle>
                <CardDescription>
                  Choose your preferred cryptocurrency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
                  <Select value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bitcoin">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                          Bitcoin (BTC)
                        </div>
                      </SelectItem>
                      <SelectItem value="ethereum">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          Ethereum (ETH)
                        </div>
                      </SelectItem>
                      <SelectItem value="litecoin">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                          Litecoin (LTC)
                        </div>
                      </SelectItem>
                      <SelectItem value="dogecoin">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          Dogecoin (DOGE)
                        </div>
                      </SelectItem>
                      <SelectItem value="usdc">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                          USD Coin (USDC)
                        </div>
                      </SelectItem>
                      <SelectItem value="usdt">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                          Tether (USDT)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedMethod && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Amount to Send:</span>
                        <span className="font-bold text-lg">
                          {getCryptoAmount()} {selectedMethod.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Rate: 1 USD = {cryptoRates[selectedMethod as keyof typeof cryptoRates]} {selectedMethod.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Send to this address:</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={walletAddress}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(walletAddress)}
                        >
                          {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">Important Instructions:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Send exactly {getCryptoAmount()} {selectedMethod.toUpperCase()}</li>
                        <li>• Payment will be confirmed within 10-30 minutes</li>
                        <li>• Double-check the wallet address before sending</li>
                        <li>• Keep your transaction ID for reference</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        ✅ <strong>Deposited funds are withdrawable</strong> - This is real money you can cash out
                      </p>
                    </div>

                    <Button 
                      onClick={handlePayment}
                      disabled={!selectedMethod || isProcessing}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Confirm {selectedMethod.toUpperCase()} Payment
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPaymentModal;
