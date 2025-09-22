import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Banknote, Smartphone, Mail } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerBalance: number;
  withdrawableBalance: number;
  bonusBalance: number;
  onWithdraw: (amount: number, method: string, details: any) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  playerBalance,
  withdrawableBalance,
  bonusBalance,
  onWithdraw
}) => {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('paypal');
  const [email, setEmail] = useState('');
  const [accountName, setAccountName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawalMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: CreditCard,
      description: 'Instant transfer to PayPal account',
      fee: 0,
      processingTime: '1-3 minutes',
      color: 'bg-blue-500'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Banknote,
      description: 'Direct deposit to your bank account',
      fee: 2.50,
      processingTime: '1-3 business days',
      color: 'bg-green-500'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Smartphone,
      description: 'Send to your crypto wallet',
      fee: 5.00,
      processingTime: '10-30 minutes',
      color: 'bg-orange-500'
    },
    {
      id: 'check',
      name: 'Check by Mail',
      icon: Mail,
      description: 'Physical check mailed to you',
      fee: 10.00,
      processingTime: '5-7 business days',
      color: 'bg-purple-500'
    }
  ];

  const selectedMethod = withdrawalMethods.find(m => m.id === method);
  const totalFee = selectedMethod?.fee || 0;
  const netAmount = amount - totalFee;
  const isValid = amount > 0 && amount <= withdrawableBalance && netAmount > 0;

  const handleWithdraw = async () => {
    if (!isValid) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const withdrawalDetails = {
      method,
      email: method === 'paypal' ? email : undefined,
      accountName: method === 'bank' ? accountName : undefined,
      routingNumber: method === 'bank' ? routingNumber : undefined,
      accountNumber: method === 'bank' ? accountNumber : undefined,
      cryptoAddress: method === 'crypto' ? cryptoAddress : undefined
    };

    onWithdraw(amount, method, withdrawalDetails);
    setIsProcessing(false);
    onClose();
  };

  const getMethodFields = () => {
    switch (method) {
      case 'paypal':
        return (
          <div className="space-y-2">
            <Label>PayPal Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              required
            />
          </div>
        );
      case 'bank':
        return (
          <div className="space-y-2">
            <Label>Account Holder Name</Label>
            <Input
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="John Doe"
              required
            />
            <Label>Routing Number</Label>
            <Input
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              placeholder="123456789"
              required
            />
            <Label>Account Number</Label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="987654321"
              required
            />
          </div>
        );
      case 'crypto':
        return (
          <div className="space-y-2">
            <Label>Wallet Address</Label>
            <Input
              value={cryptoAddress}
              onChange={(e) => setCryptoAddress(e.target.value)}
              placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              required
            />
            <p className="text-xs text-gray-500">
              Enter your Bitcoin, Ethereum, or other crypto wallet address
            </p>
          </div>
        );
      case 'check':
        return (
          <div className="space-y-2">
            <Label>Mailing Address</Label>
            <Input
              placeholder="123 Main St, City, State 12345"
              required
            />
            <p className="text-xs text-gray-500">
              Physical check will be mailed to this address
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">💸 Withdraw Funds</CardTitle>
            <p className="text-center text-gray-600">
              Choose your preferred withdrawal method
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Balance Display */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${withdrawableBalance.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Withdrawable Balance</div>
                {bonusBalance > 0 && (
                  <div className="text-sm text-orange-600 mt-1">
                    + ${bonusBalance.toFixed(2)} Bonus (Not Withdrawable)
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Total Balance: ${playerBalance.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>Withdrawal Amount</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  min="1"
                  max={withdrawableBalance}
                  step="0.01"
                  className="flex-1"
                  placeholder="Enter amount"
                />
                <Button
                  onClick={() => setAmount(withdrawableBalance)}
                  variant="outline"
                  size="sm"
                >
                  Max
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  onClick={() => setAmount(25)}
                  variant="outline"
                  size="sm"
                >
                  $25
                </Button>
                <Button
                  onClick={() => setAmount(50)}
                  variant="outline"
                  size="sm"
                >
                  $50
                </Button>
                <Button
                  onClick={() => setAmount(100)}
                  variant="outline"
                  size="sm"
                >
                  $100
                </Button>
                <Button
                  onClick={() => setAmount(250)}
                  variant="outline"
                  size="sm"
                >
                  $250
                </Button>
              </div>
            </div>

            {/* Withdrawal Methods */}
            <div className="space-y-2">
              <Label>Withdrawal Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {withdrawalMethods.map((methodOption) => {
                  const Icon = methodOption.icon;
                  return (
                    <Button
                      key={methodOption.id}
                      onClick={() => setMethod(methodOption.id)}
                      variant={method === methodOption.id ? "default" : "outline"}
                      className={`h-auto p-3 flex flex-col items-start ${
                        method === methodOption.id ? 'bg-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{methodOption.name}</span>
                        {methodOption.fee > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            ${methodOption.fee} fee
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-left mt-1 opacity-75">
                        {methodOption.description}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Method-specific fields */}
            {getMethodFields()}

            {/* Fee and Net Amount */}
            {amount > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Withdrawal Amount:</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
                {totalFee > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Processing Fee:</span>
                    <span>-${totalFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>You'll Receive:</span>
                  <span className="text-green-600">${netAmount.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Processing time: {selectedMethod?.processingTime}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleWithdraw}
                disabled={!isValid || isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Withdraw $${amount.toFixed(2)}`
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-gray-500 text-center">
              <p>Withdrawals are processed during business hours (9 AM - 5 PM EST)</p>
              <p>All transactions are subject to verification and may take longer during peak times</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WithdrawalModal;
