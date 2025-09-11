import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Settings } from 'lucide-react';

interface PushNotificationsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const PushNotifications: React.FC<PushNotificationsProps> = ({ enabled, onToggle }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      alert('This browser does not support notifications');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        onToggle(true);
        showWelcomeNotification();
      } else {
        onToggle(false);
        alert('Notifications blocked. You can enable them in your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      alert('Failed to request notification permission');
    }
  };

  const showWelcomeNotification = () => {
    if (permission === 'granted') {
      new Notification('BingoBest Notifications Enabled!', {
        body: 'You\'ll now receive notifications for game events, wins, and more!',
        icon: '/favicon-32x32.png',
        badge: '/favicon-32x32.png',
        tag: 'welcome'
      });
    }
  };

  const showTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from BingoBest!',
        icon: '/favicon-32x32.png',
        tag: 'test'
      });
    }
  };

  const sendGameNotification = (title: string, body: string, data?: any) => {
    if (permission === 'granted' && enabled) {
      new Notification(title, {
        body,
        icon: '/favicon-32x32.png',
        badge: '/favicon-32x32.png',
        data,
        tag: 'game-event'
      });
    }
  };

  // Expose notification function for other components
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    sendGameNotification
  }));

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Notifications Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {enabled ? <Bell className="w-5 h-5 text-green-500" /> : <BellOff className="w-5 h-5 text-gray-400" />}
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Game Notifications</p>
            <p className="text-sm text-gray-600">
              Get notified about game events, wins, and important updates
            </p>
          </div>
          <div className="flex items-center gap-2">
            {permission === 'granted' ? (
              <Button
                onClick={() => onToggle(!enabled)}
                variant={enabled ? 'default' : 'outline'}
                size="sm"
              >
                {enabled ? 'Enabled' : 'Disabled'}
              </Button>
            ) : (
              <Button
                onClick={requestPermission}
                size="sm"
              >
                Enable Notifications
              </Button>
            )}
          </div>
        </div>

        {permission === 'granted' && (
          <div className="space-y-2">
            <Button
              onClick={showTestNotification}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Send Test Notification
            </Button>
            <p className="text-xs text-gray-500">
              Click to test if notifications are working properly
            </p>
          </div>
        )}

        {permission === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">
              Notifications are blocked. To enable them:
            </p>
            <ol className="text-xs text-red-600 mt-2 list-decimal list-inside space-y-1">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Select "Allow" for notifications</li>
              <li>Refresh the page</li>
            </ol>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>You'll receive notifications for:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Game wins and achievements</li>
            <li>New tournaments and events</li>
            <li>Daily challenges and rewards</li>
            <li>Important app updates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PushNotifications;
