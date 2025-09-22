# PayPal Integration Setup Guide

## 🚀 Quick Setup for BingoBest

### Step 1: Create PayPal Developer Account

1. **Go to PayPal Developer Portal**
   - Visit: https://developer.paypal.com/
   - Sign in with your PayPal account
   - Click "Create App"

2. **Create New Application**
   - **App Name**: `BingoBest Payment System`
   - **Merchant**: Select your business account
   - **Features**: Enable "Accept payments"
   - Click "Create App"

### Step 2: Get Your Client ID

1. **Copy Sandbox Client ID** (for testing)
   - Use this for development and testing
   - Safe to use in public repositories

2. **Copy Live Client ID** (for production)
   - Use this for live payments
   - Keep this secure and private

### Step 3: Add to Environment Variables

Add to your `.env.local` file:
```env
VITE_PAYPAL_CLIENT_ID=your_sandbox_client_id_here
```

For production, update to:
```env
VITE_PAYPAL_CLIENT_ID=your_live_client_id_here
```

### Step 4: Test the Integration

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Go to Wallet tab**
   - Click "Wallet" in navigation
   - Click "💳 Pay with PayPal"

3. **Test with PayPal Sandbox**
   - Use PayPal sandbox test accounts
   - No real money will be charged

## 🔧 PayPal Sandbox Testing

### Test Accounts (Use these for testing)

**Buyer Account:**
- Email: `sb-buyer@personal.example.com`
- Password: `password123`

**Merchant Account:**
- Email: `sb-merchant@business.example.com`
- Password: `password123`

### Test Payment Flow

1. **Click "Pay with PayPal"**
2. **Enter test amount** (e.g., $10)
3. **Click PayPal button**
4. **Login with sandbox buyer account**
5. **Complete payment**
6. **Verify balance updates**

## 🚀 Production Deployment

### Step 1: Switch to Live Client ID

Update your environment variables:
```env
VITE_PAYPAL_CLIENT_ID=your_live_client_id_here
```

### Step 2: Configure Webhooks (Optional)

1. **Go to PayPal Developer Dashboard**
2. **Select your app**
3. **Go to Webhooks section**
4. **Add webhook URL**: `https://your-domain.com/api/paypal/webhook`
5. **Select events**: `PAYMENT.CAPTURE.COMPLETED`

### Step 3: Test Live Payments

1. **Use real PayPal accounts**
2. **Test with small amounts first**
3. **Verify payments in PayPal dashboard**

## 🔒 Security Best Practices

### Environment Variables
- ✅ **Never commit** `.env.local` to git
- ✅ **Use different** Client IDs for dev/prod
- ✅ **Rotate keys** regularly

### Payment Security
- ✅ **Validate amounts** server-side
- ✅ **Log all transactions**
- ✅ **Implement fraud detection**
- ✅ **Use HTTPS** in production

## 🐛 Troubleshooting

### Common Issues

**PayPal buttons not showing:**
- Check if `VITE_PAYPAL_CLIENT_ID` is set
- Verify Client ID is correct
- Check browser console for errors

**Payment not completing:**
- Ensure you're using sandbox accounts for testing
- Check PayPal developer dashboard for errors
- Verify webhook URLs are accessible

**CORS errors:**
- Add your domain to PayPal app settings
- Use HTTPS in production
- Check browser security settings

## 📞 Support

### PayPal Support
- **Developer Portal**: https://developer.paypal.com/
- **Documentation**: https://developer.paypal.com/docs/
- **Support**: https://www.paypal.com/support/

### BingoBest Support
- **Email**: support@bingobest.live
- **Issues**: Check console logs for errors
- **Testing**: Use sandbox mode first

## 🎯 Next Steps

1. **Test thoroughly** with sandbox accounts
2. **Implement server-side validation**
3. **Add transaction logging**
4. **Set up monitoring**
5. **Go live** with small amounts first

---

**Ready to accept real payments!** 🎉
