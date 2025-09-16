import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, CheckCircle } from 'lucide-react';

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: () => void;
}

const CryptoPaymentModal: React.FC<CryptoPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock wallet addresses for different cryptocurrencies
  const cryptoWallets = {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    litecoin: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    dogecoin: 'D7Y55vJ8qZc4G2Qj8F9vK3mN6pL1sT4wX7yA2bC5eH8'
  };

  const cryptoRates = {
    bitcoin: 0.000023, // BTC per USD
    ethereum: 0.00038, // ETH per USD
    litecoin: 0.0034, // LTC per USD
    dogecoin: 0.45 // DOGE per USD
  };

  const getCryptoAmount = () => {
    if (!selectedCrypto || !cryptoRates[selectedCrypto as keyof typeof cryptoRates]) return 0;
    return ((amount || 0) * (cryptoRates[selectedCrypto as keyof typeof cryptoRates] || 0)).toFixed(8);
  };

  const getWalletAddress = () => {
    if (!selectedCrypto || !cryptoWallets[selectedCrypto as keyof typeof cryptoWallets]) return '';
    return cryptoWallets[selectedCrypto as keyof typeof cryptoWallets];
  };

  const handleCopyAddress = async () => {
    const address = getWalletAddress();
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cryptocurrency Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
              <CardDescription>
                Amount: ${(amount || 0).toFixed(2)} USD
              </CardDescription>
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-xs text-green-800">
                  ✅ <strong>Deposited funds are withdrawable</strong> - This is real money you can cash out
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
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
                    </SelectContent>
                  </Select>
                </div>

                {selectedCrypto && (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Amount to Send:</span>
                        <Badge variant="secondary">
                          {getCryptoAmount()} {selectedCrypto.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        Rate: 1 USD = {cryptoRates[selectedCrypto as keyof typeof cryptoRates]} {selectedCrypto.toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <Label>Wallet Address</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={getWalletAddress()}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyAddress}
                          disabled={!getWalletAddress()}
                        >
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 text-yellow-600">⚠️</div>
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Important Instructions:</p>
                <ul className="mt-1 text-yellow-700 space-y-1">
                  <li>• Send exactly {getCryptoAmount()} {selectedCrypto.toUpperCase()}</li>
                  <li>• Include your username in the transaction memo</li>
                  <li>• Payment will be confirmed within 10-30 minutes</li>
                  <li>• Contact support if you have any issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!selectedCrypto || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoPaymentModal;
