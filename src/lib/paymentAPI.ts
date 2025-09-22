// Payment API Integration
export interface PaymentRequest {
  amount: number;
  currency: string;
  method: 'paypal' | 'crypto';
  cryptoType?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  approvalUrl?: string;
  walletAddress?: string;
  cryptoAmount?: number;
  error?: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  transactionId?: string;
}

class PaymentAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Create PayPal payment
  async createPayPalPayment(amount: number, currency: string = 'USD'): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/paypal/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          returnUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        paymentId: data.paymentId,
        approvalUrl: data.approvalUrl,
      };
    } catch (error) {
      console.error('PayPal payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Execute PayPal payment
  async executePayPalPayment(paymentId: string, payerId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/paypal/execute-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          payerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        paymentId: data.paymentId,
      };
    } catch (error) {
      console.error('PayPal payment execution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Create crypto payment
  async createCryptoPayment(amount: number, cryptoType: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/crypto/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          cryptoType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        paymentId: data.paymentId,
        walletAddress: data.walletAddress,
        cryptoAmount: data.cryptoAmount,
      };
    } catch (error) {
      console.error('Crypto payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Check payment status
  async checkPaymentStatus(paymentId: string, method: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/status/${method}/${paymentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        paymentId: data.paymentId,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        transactionId: data.transactionId,
      };
    } catch (error) {
      console.error('Payment status check error:', error);
      return {
        paymentId,
        status: 'failed',
        amount: 0,
        currency: 'USD',
      };
    }
  }

  // Get crypto rates
  async getCryptoRates(): Promise<Record<string, number>> {
    try {
      const response = await fetch(`${this.baseUrl}/crypto/rates`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.rates;
    } catch (error) {
      console.error('Crypto rates fetch error:', error);
      // Return default rates
      return {
        bitcoin: 0.000023,
        ethereum: 0.00038,
        litecoin: 0.0034,
        dogecoin: 0.45,
        usdc: 1.0,
        usdt: 1.0,
      };
    }
  }
}

// Mock Payment API for development
export class MockPaymentAPI extends PaymentAPI {
  constructor() {
    super('/api');
  }

  async createPayPalPayment(amount: number, currency: string = 'USD'): Promise<PaymentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      paymentId: `PP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      approvalUrl: `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${Date.now()}`,
    };
  }

  async executePayPalPayment(paymentId: string, payerId: string): Promise<PaymentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      paymentId,
    };
  }

  async createCryptoPayment(amount: number, cryptoType: string): Promise<PaymentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const walletAddresses = {
      bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      litecoin: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      dogecoin: 'D7Y55vJ8qZc4G2Qj8F9vK3mN6pL1sT4wX7yA2bC5eH8',
      usdc: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      usdt: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    };

    const rates = {
      bitcoin: 0.000023,
      ethereum: 0.00038,
      litecoin: 0.0034,
      dogecoin: 0.45,
      usdc: 1.0,
      usdt: 1.0,
    };

    return {
      success: true,
      paymentId: `${cryptoType.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      walletAddress: walletAddresses[cryptoType as keyof typeof walletAddresses] || '',
      cryptoAmount: amount * (rates[cryptoType as keyof typeof rates] || 1),
    };
  }

  async checkPaymentStatus(paymentId: string, method: string): Promise<PaymentStatus> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock status - randomly return completed or pending
    const isCompleted = Math.random() > 0.3;
    
    return {
      paymentId,
      status: isCompleted ? 'completed' : 'pending',
      amount: 100,
      currency: method === 'paypal' ? 'USD' : method.toUpperCase(),
      transactionId: `TX_${Date.now()}`,
    };
  }

  async getCryptoRates(): Promise<Record<string, number>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      bitcoin: 0.000023,
      ethereum: 0.00038,
      litecoin: 0.0034,
      dogecoin: 0.45,
      usdc: 1.0,
      usdt: 1.0,
    };
  }
}

// Export singleton instance
export const paymentAPI = new MockPaymentAPI();
