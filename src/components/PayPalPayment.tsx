import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PayPalPaymentProps {
  onPaymentSuccess: (amount: number, transactionId: string) => void;
  onPaymentError: (error: string) => void;
  onClose: () => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  onPaymentSuccess,
  onPaymentError,
  onClose
}) => {
  const [amount, setAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2)
          },
          description: `BingoBest Deposit - $${amount.toFixed(2)}`
        }
      ],
      application_context: {
        brand_name: 'BingoBest',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      }
    });
  };

  const handleApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    
    try {
      const order = await actions.order.capture();
      
      if (order.status === 'COMPLETED') {
        const transactionId = order.id;
        console.log('PayPal payment successful:', order);
        
        // Call success callback
        onPaymentSuccess(amount, transactionId);
        
        // Show success message
        alert(`Payment successful! Added $${amount.toFixed(2)} to your account.\n\nTransaction ID: ${transactionId}`);
        
        // Close the payment interface
        onClose();
      } else {
        throw new Error('Payment was not completed');
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      onPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: any) => {
    console.error('PayPal error:', error);
    onPaymentError('Payment error occurred. Please try again.');
    setIsProcessing(false);
  };

  const handleCancel = () => {
    console.log('PayPal payment cancelled');
    onPaymentError('Payment was cancelled.');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">💳 Add Funds with PayPal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Amount to Add (USD)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              min="1"
              max="1000"
              step="0.01"
              className="flex-1"
            />
            <div className="text-sm text-gray-600 flex items-center">
              ${amount.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => setAmount(10)} 
            variant="outline"
            size="sm"
          >
            $10
          </Button>
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
        </div>

        {isProcessing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Processing payment...</p>
          </div>
        )}

        {!isProcessing && (
          <div className="space-y-2">
            <PayPalButtons
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
              onError={handleError}
              onCancel={handleCancel}
              style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal'
              }}
            />
          </div>
        )}

        <div className="text-center">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayPalPayment;
