import React, { createContext, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

interface NotificationContextType {
  requestPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
  permission: NotificationPermission;
}

const NotificationContext = createContext<NotificationContextType>({
  requestPermission: async () => false,
  sendNotification: () => {},
  isSupported: false,
  permission: 'default'
});

export const usePushNotifications = () => useContext(NotificationContext);

interface PushNotificationsProps {
  children: React.ReactNode;
}

const PushNotifications: React.FC<PushNotificationsProps> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted' || !isSupported) return;

    try {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const value = {
    requestPermission,
    sendNotification,
    isSupported,
    permission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification permission request component
export const NotificationPermissionRequest: React.FC = () => {
  const { requestPermission, isSupported, permission } = usePushNotifications();
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isSupported || permission === 'granted') {
    return null;
  }

  const handleRequest = async () => {
    setIsRequesting(true);
    await requestPermission();
    setIsRequesting(false);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {permission === 'denied' ? (
            <BellOff className="w-5 h-5 text-red-500" />
          ) : (
            <Bell className="w-5 h-5 text-blue-500" />
          )}
          <div>
            <p className="font-medium text-blue-900">
              {permission === 'denied' 
                ? 'Notifications Blocked' 
                : 'Enable Notifications'
              }
            </p>
            <p className="text-sm text-blue-700">
              {permission === 'denied'
                ? 'Enable notifications in your browser settings to get game alerts'
                : 'Get notified about game updates, wins, and special events'
              }
            </p>
          </div>
        </div>
        {permission !== 'denied' && (
          <Button
            onClick={handleRequest}
            disabled={isRequesting}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRequesting ? 'Requesting...' : 'Enable'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PushNotifications;