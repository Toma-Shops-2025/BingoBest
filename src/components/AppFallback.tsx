import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface AppFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

const AppFallback: React.FC<AppFallbackProps> = ({ error, onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-600">Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We're sorry, but something unexpected happened. Don't worry, your progress is saved!
          </p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
          
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            <p>If this problem persists, please:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Check your internet connection</li>
              <li>Clear your browser cache</li>
              <li>Try using a different browser</li>
              <li>Contact support if the issue continues</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppFallback;
