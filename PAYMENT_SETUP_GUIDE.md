# BingoBest Payment System Setup Guide

## Step-by-Step Setup Instructions

### Phase 1: PayPal Integration Setup

#### Step 1: Create PayPal Developer Account
1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Click "Sign Up" or "Log In" with your PayPal account
3. Complete the developer registration process
4. Verify your email address

#### Step 2: Create PayPal App
1. In the PayPal Developer Dashboard, click "Create App"
2. Choose "Default Application" or "Custom Application"
3. Fill in the app details:
   - **App Name**: "BingoBest Payment Integration"
   - **Merchant**: Select your business account
   - **Sandbox**: Check this for testing
4. Click "Create App"
5. **IMPORTANT**: Save your Client ID and Secret (you'll need these)

#### Step 3: Configure PayPal Webhooks
1. In your app settings, go to "Webhooks"
2. Click "Add Webhook"
3. Set the webhook URL: `https://yourdomain.com/api/paypal/webhook`
4. Select these events:
   - `PAYMENT.SALE.COMPLETED`
   - `PAYMENT.SALE.DENIED`
   - `PAYMENT.SALE.REFUNDED`
5. Save the webhook

#### Step 4: Set Up Return URLs
1. In your app settings, go to "App Settings"
2. Set these URLs:
   - **Return URL**: `https://yourdomain.com/payment/success`
   - **Cancel URL**: `https://yourdomain.com/payment/cancel`

### Phase 2: Environment Configuration

#### Step 5: Update Environment Variables
Create or update your `.env.local` file:

```env
# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
VITE_PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
VITE_PAYPAL_ENVIRONMENT=sandbox

# Site Configuration
VITE_SITE_URL=https://yourdomain.com

# Optional: Crypto Rate APIs (for enhanced features)
VITE_COINGECKO_API_KEY=your_coingecko_api_key
VITE_BLOCKCHAIN_API_KEY=your_blockchain_api_key
```

#### Step 6: Update PayPal Service Configuration
Edit `src/lib/paypalService.ts` and update the configuration:

```typescript
// Update the PayPalConfig in the constructor
constructor(config: PayPalConfig) {
  this.config = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    environment: import.meta.env.VITE_PAYPAL_ENVIRONMENT as 'sandbox' | 'production',
    currency: 'USD',
  };
}
```

### Phase 3: Backend API Setup

#### Step 7: Create Backend API Endpoints
Create these API endpoints in your backend:

**File: `api/paypal/create-payment.js`**
```javascript
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency, returnUrl, cancelUrl } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toString()
      }
    }],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl
    }
  });

  try {
    const order = await client.execute(request);
    res.status(200).json({
      paymentId: order.result.id,
      approvalUrl: order.result.links.find(link => link.rel === 'approve').href
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**File: `api/paypal/execute-payment.js`**
```javascript
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId, payerId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(paymentId);
  request.requestBody({});

  try {
    const order = await client.execute(request);
    res.status(200).json({
      paymentId: order.result.id,
      status: order.result.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### Step 8: Install PayPal SDK
In your project root, run:
```bash
npm install @paypal/checkout-server-sdk
```

### Phase 4: Crypto Wallet Setup

#### Step 9: Generate Crypto Wallet Addresses
For each cryptocurrency, generate secure wallet addresses:

**Bitcoin (BTC):**
- Use a hardware wallet or secure software wallet
- Generate a new address for receiving payments
- Example: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`

**Ethereum (ETH):**
- Use MetaMask or similar wallet
- Generate a new address
- Example: `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`

**Litecoin (LTC):**
- Use Litecoin Core or similar wallet
- Generate a new address
- Example: `ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`

**Dogecoin (DOGE):**
- Use Dogecoin Core or similar wallet
- Generate a new address
- Example: `D7Y55vJ8qZc4G2Qj8F9vK3mN6pL1sT4wX7yA2bC5eH8`

#### Step 10: Update Crypto Wallet Addresses
Edit `src/lib/cryptoService.ts` and update the wallet addresses:

```typescript
const cryptoWallets = {
  bitcoin: 'YOUR_BITCOIN_ADDRESS_HERE',
  ethereum: 'YOUR_ETHEREUM_ADDRESS_HERE',
  litecoin: 'YOUR_LITECOIN_ADDRESS_HERE',
  dogecoin: 'YOUR_DOGECOIN_ADDRESS_HERE',
  usdc: 'YOUR_USDC_ADDRESS_HERE',
  usdt: 'YOUR_USDT_ADDRESS_HERE'
};
```

### Phase 5: Database Setup

#### Step 11: Add Payment Tables
Add these tables to your Supabase database:

```sql
-- Payment transactions table
CREATE TABLE payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crypto payments table
CREATE TABLE crypto_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  currency VARCHAR(10) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  confirmations INTEGER DEFAULT 0,
  required_confirmations INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PayPal payments table
CREATE TABLE paypal_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paypal_order_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Step 12: Create Database Functions
Add these functions to your Supabase database:

```sql
-- Function to update payment status
CREATE OR REPLACE FUNCTION update_payment_status(
  p_payment_id VARCHAR(255),
  p_status VARCHAR(20),
  p_transaction_id VARCHAR(255) DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE payment_transactions 
  SET status = p_status, 
      transaction_id = COALESCE(p_transaction_id, transaction_id),
      updated_at = NOW()
  WHERE payment_id = p_payment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get payment by ID
CREATE OR REPLACE FUNCTION get_payment_by_id(p_payment_id VARCHAR(255))
RETURNS TABLE (
  id UUID,
  user_id UUID,
  payment_id VARCHAR(255),
  payment_method VARCHAR(50),
  amount DECIMAL(10,2),
  currency VARCHAR(10),
  status VARCHAR(20),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT pt.id, pt.user_id, pt.payment_id, pt.payment_method, 
         pt.amount, pt.currency, pt.status, pt.transaction_id, pt.created_at
  FROM payment_transactions pt
  WHERE pt.payment_id = p_payment_id;
END;
$$ LANGUAGE plpgsql;
```

### Phase 6: Testing

#### Step 13: Test PayPal Integration
1. Start your development server: `npm run dev`
2. Go to the payment modal
3. Select PayPal tab
4. Enter a test amount (e.g., $10)
5. Click "Pay with PayPal"
6. Use PayPal sandbox credentials:
   - **Email**: sb-buyer@personal.example.com
   - **Password**: password123
7. Complete the payment
8. Verify the balance is updated

#### Step 14: Test Crypto Integration
1. Go to the payment modal
2. Select Crypto tab
3. Choose a cryptocurrency (e.g., Bitcoin)
4. Copy the wallet address
5. Send a small test amount
6. Wait for confirmations
7. Verify the balance is updated

### Phase 7: Production Deployment

#### Step 15: Switch to Production
1. Update environment variables:
   ```env
   VITE_PAYPAL_ENVIRONMENT=production
   VITE_PAYPAL_CLIENT_ID=your_production_client_id
   ```

2. Update PayPal app settings:
   - Switch to production mode
   - Update webhook URLs to production
   - Update return/cancel URLs

3. Update crypto addresses:
   - Use mainnet addresses (not testnet)
   - Ensure addresses are secure and backed up

#### Step 16: Security Checklist
- [ ] PayPal webhooks are configured
- [ ] Crypto wallet addresses are secure
- [ ] Environment variables are set
- [ ] Database tables are created
- [ ] API endpoints are working
- [ ] Error handling is implemented
- [ ] Logging is configured
- [ ] Monitoring is set up

### Phase 8: Monitoring and Maintenance

#### Step 17: Set Up Monitoring
1. **PayPal Monitoring**:
   - Monitor webhook deliveries
   - Check payment success rates
   - Monitor failed payments

2. **Crypto Monitoring**:
   - Monitor blockchain confirmations
   - Check wallet balances
   - Monitor exchange rates

3. **Database Monitoring**:
   - Monitor payment transactions
   - Check for failed payments
   - Monitor user balance updates

#### Step 18: Regular Maintenance
1. **Weekly Tasks**:
   - Check payment success rates
   - Monitor crypto confirmations
   - Update exchange rates

2. **Monthly Tasks**:
   - Review payment logs
   - Update crypto addresses if needed
   - Check PayPal webhook status

3. **Quarterly Tasks**:
   - Review security measures
   - Update payment methods
   - Review fee structures

## Troubleshooting

### Common Issues and Solutions

#### PayPal Issues
**Problem**: PayPal payments not processing
**Solution**: 
1. Check client ID and secret
2. Verify webhook configuration
3. Check return/cancel URLs
4. Ensure PayPal app is approved

#### Crypto Issues
**Problem**: Crypto payments not confirming
**Solution**:
1. Verify wallet addresses
2. Check network status
3. Ensure sufficient confirmations
4. Monitor blockchain

#### Database Issues
**Problem**: Payment data not saving
**Solution**:
1. Check database connection
2. Verify table structure
3. Check user permissions
4. Review error logs

## Support Resources

### PayPal Resources
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Support](https://www.paypal.com/support)
- [PayPal Community](https://www.paypal.com/community)

### Crypto Resources
- [Bitcoin Documentation](https://bitcoin.org/en/developer-documentation)
- [Ethereum Documentation](https://ethereum.org/en/developers/)
- [Litecoin Documentation](https://litecoin.org/en/developer-documentation)

### General Support
- Check the console for errors
- Review network requests
- Check database logs
- Contact development team

## Next Steps

After completing this setup:

1. **Test thoroughly** with small amounts
2. **Monitor payments** for 24-48 hours
3. **Set up alerts** for failed payments
4. **Train support team** on new payment methods
5. **Update user documentation**
6. **Plan for scaling** as volume grows

Remember to always test in sandbox/testnet before going to production!
