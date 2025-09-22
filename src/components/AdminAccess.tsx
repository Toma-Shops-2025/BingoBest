import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock } from 'lucide-react';

interface AdminAccessProps {
  onAdminAccess: () => void;
}

const AdminAccess: React.FC<AdminAccessProps> = ({ onAdminAccess }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check (in production, use proper authentication)
    if (password === 'BingoBest2024!') {
      setIsAuthenticated(true);
      setError('');
      setTimeout(() => {
        onAdminAccess();
      }, 1000);
    } else {
      setError('Invalid admin password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-green-600 text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Admin Access Granted</h3>
            <p className="text-gray-600">Redirecting to Platform Dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Admin Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pr-10"
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Access Platform Dashboard
            </Button>
          </form>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Platform dashboard contains sensitive financial information
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccess;
