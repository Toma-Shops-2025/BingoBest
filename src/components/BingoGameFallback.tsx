import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BingoGameFallbackProps {
  onBack: () => void;
}

const BingoGameFallback: React.FC<BingoGameFallbackProps> = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bingo Game - Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The bingo game is temporarily unavailable. We're working on fixing this issue.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">What you can do:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your internet connection</li>
              <li>• Try refreshing the page</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline">
              Back to Game Rooms
            </Button>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BingoGameFallback;
