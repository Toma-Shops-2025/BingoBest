# BingoBest Payment Setup Checklist

## Quick Setup Checklist

### ✅ Phase 1: PayPal Setup (30 minutes)
- [ ] Create PayPal Developer account
- [ ] Create PayPal app and get Client ID
- [ ] Configure webhooks
- [ ] Set return/cancel URLs
- [ ] Add PayPal Client ID to `.env.local`

### ✅ Phase 2: Environment Setup (15 minutes)
- [ ] Update `.env.local` with PayPal credentials
- [ ] Install PayPal SDK: `npm install @paypal/checkout-server-sdk`
- [ ] Update PayPal service configuration
- [ ] Test environment variables

### ✅ Phase 3: Crypto Setup (20 minutes)
- [ ] Generate Bitcoin wallet address
- [ ] Generate Ethereum wallet address
- [ ] Generate Litecoin wallet address
- [ ] Generate Dogecoin wallet address
- [ ] Update crypto addresses in `cryptoService.ts`

### ✅ Phase 4: Database Setup (15 minutes)
- [ ] Create payment_transactions table
- [ ] Create crypto_payments table
- [ ] Create paypal_payments table
- [ ] Add database functions
- [ ] Test database connections

### ✅ Phase 5: Testing (30 minutes)
- [ ] Test PayPal payment flow
- [ ] Test crypto payment flow
- [ ] Verify balance updates
- [ ] Check error handling
- [ ] Test on mobile devices

### ✅ Phase 6: Production (20 minutes)
- [ ] Switch to production PayPal
- [ ] Update crypto addresses to mainnet
- [ ] Configure production webhooks
- [ ] Test with real payments
- [ ] Set up monitoring

## Total Setup Time: ~2 hours

## Critical Files to Update

### 1. Environment Variables (`.env.local`)
```env
VITE_PAYPAL_CLIENT_ID=your_client_id_here
VITE_PAYPAL_CLIENT_SECRET=your_client_secret_here
VITE_PAYPAL_ENVIRONMENT=sandbox
VITE_SITE_URL=https://yourdomain.com
```

### 2. Crypto Addresses (`src/lib/cryptoService.ts`)
```typescript
const cryptoWallets = {
  bitcoin: 'YOUR_BITCOIN_ADDRESS',
  ethereum: 'YOUR_ETHEREUM_ADDRESS',
  litecoin: 'YOUR_LITECOIN_ADDRESS',
  dogecoin: 'YOUR_DOGECOIN_ADDRESS',
  usdc: 'YOUR_USDC_ADDRESS',
  usdt: 'YOUR_USDT_ADDRESS'
};
```

### 3. Database Tables
Run the SQL commands in the setup guide to create the required tables.

## Testing Credentials

### PayPal Sandbox
- **Email**: sb-buyer@personal.example.com
- **Password**: password123

### Test Amounts
- **PayPal**: $1.00 (minimum for testing)
- **Crypto**: 0.0001 BTC, 0.001 ETH, etc.

## Common Issues

### PayPal Not Working
1. Check Client ID is correct
2. Verify webhook URLs
3. Ensure return/cancel URLs are set
4. Check PayPal app status

### Crypto Not Working
1. Verify wallet addresses are correct
2. Check network status
3. Ensure sufficient confirmations
4. Monitor blockchain

### Database Issues
1. Check table creation
2. Verify user permissions
3. Check connection strings
4. Review error logs

## Support

If you run into issues:
1. Check the console for errors
2. Review the detailed setup guide
3. Test with small amounts first
4. Contact the development team

## Ready to Start?

1. **Begin with PayPal setup** (easiest to test)
2. **Move to crypto setup** (requires wallet addresses)
3. **Test thoroughly** before production
4. **Monitor payments** after deployment

Remember: Always test in sandbox/testnet first!
