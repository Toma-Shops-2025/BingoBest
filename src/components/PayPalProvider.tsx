import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalProviderProps {
  children: React.ReactNode;
}

const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  
  if (!paypalClientId) {
    console.warn('PayPal Client ID not found. PayPal payments will not work.');
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture',
        components: 'buttons',
        enableFunding: 'venmo,card',
        disableFunding: 'credit,paylater',
        dataSdkIntegration: 'react-paypal-js'
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
