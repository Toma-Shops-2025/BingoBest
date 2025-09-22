import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PayPalPayment from './PayPalPayment';

interface SimplePaymentSystemProps {
  playerBalance: number;
  onAddFunds: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const SimplePaymentSystem: React.FC<SimplePaymentSystemProps> = ({
  playerBalance,
  onAddFunds,
  onWithdraw
}) => {
  const [addAmount, setAddAmount] = useState(10);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);

  const handleAddFunds = () => {
    if (addAmount > 0) {
      onAddFunds(addAmount);
      setShowAddFunds(false);
      alert(`Added $${addAmount} to your account!`);
    }
  };

  const handleWithdraw = () => {
    if (withdrawAmount > 0 && withdrawAmount <= playerBalance) {
      onWithdraw(withdrawAmount);
      setShowWithdraw(false);
      alert(`Withdrew $${withdrawAmount} from your account!`);
    } else if (withdrawAmount > playerBalance) {
      alert('Insufficient funds!');
    }
  };

  const handlePayPalSuccess = (amount: number, transactionId: string) => {
    onAddFunds(amount);
    setShowPayPal(false);
    console.log(`PayPal payment successful: $${amount} - ${transactionId}`);
  };

  const handlePayPalError = (error: string) => {
    alert(`PayPal Error: ${error}`);
    setShowPayPal(false);
  };

  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">💰 Your Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              ${playerBalance.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Available for games and withdrawals
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Funds Section */}
      <Card>
        <CardHeader>
          <CardTitle>💳 Add Money</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Amount to Add</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(parseFloat(e.target.value) || 0)}
                min="1"
                max="1000"
                step="0.01"
                className="flex-1"
              />
              <Button onClick={handleAddFunds} className="bg-green-600 hover:bg-green-700">
                Add ${addAmount.toFixed(2)}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => setAddAmount(10)} 
              variant="outline"
              className="text-sm"
            >
              $10
            </Button>
            <Button 
              onClick={() => setAddAmount(25)} 
              variant="outline"
              className="text-sm"
            >
              $25
            </Button>
            <Button 
              onClick={() => setAddAmount(50)} 
              variant="outline"
              className="text-sm"
            >
              $50
            </Button>
            <Button 
              onClick={() => setAddAmount(100)} 
              variant="outline"
              className="text-sm"
            >
              $100
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={() => setShowPayPal(true)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              💳 Pay with PayPal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Section */}
      <Card>
        <CardHeader>
          <CardTitle>💸 Withdraw Winnings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Amount to Withdraw</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                min="1"
                max={playerBalance}
                step="0.01"
                className="flex-1"
              />
              <Button 
                onClick={handleWithdraw} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={withdrawAmount <= 0 || withdrawAmount > playerBalance}
              >
                Withdraw ${withdrawAmount.toFixed(2)}
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Maximum withdrawal: ${playerBalance.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => {
            setAddAmount(10);
            handleAddFunds();
          }} 
          className="bg-green-600 hover:bg-green-700"
        >
          Quick Add $10
        </Button>
        <Button 
          onClick={() => {
            setWithdrawAmount(playerBalance);
            handleWithdraw();
          }} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={playerBalance <= 0}
        >
          Withdraw All
        </Button>
      </div>

      {/* PayPal Payment Modal */}
      {showPayPal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <PayPalPayment
              onPaymentSuccess={handlePayPalSuccess}
              onPaymentError={handlePayPalError}
              onClose={() => setShowPayPal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplePaymentSystem;