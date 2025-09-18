import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Target, Star } from 'lucide-react';

const GameInstructions: React.FC = () => {
  const winningPatterns = [
    { name: 'Line', description: 'Complete any horizontal, vertical, or diagonal line' },
    { name: '4 CORNERS', description: 'Mark all four corner squares' },
    { name: 'X', description: 'Mark both diagonal lines forming an X' },
    { name: 'Full House', description: 'Mark all 25 squares on your card' }
  ];


  return (
    <div 
      className="mb-6 rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url('/HTPBB-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Dark Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1
        }}
      />
      
      {/* Force image load for debugging */}
      <div style={{ display: 'none' }}>
        <img 
          src="/HTPBB-background.jpg" 
          onLoad={() => console.log('✅ HTPBB-background.jpg loaded successfully!')}
          onError={(e) => console.log('❌ HTPBB-background.jpg failed to load:', e)}
          alt="HTPBB Background"
        />
      </div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2 text-white mb-6">
          <Info className="w-5 h-5" />
          <h2 className="text-xl font-semibold">How to Play BingoBest</h2>
        </div>
        <div className="space-y-6">
        {/* Basic Rules */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
            <Target className="w-5 h-5" />
            Basic Rules
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li>• Numbers are called randomly and appear in the center display</li>
            <li>• Mark numbers on your card when they're called</li>
            <li>• Complete winning patterns to win cash prizes</li>
            <li>• Each game lasts 5 minutes or until someone wins</li>
            <li>• Multiple players can win in the same game</li>
          </ul>
        </div>

        {/* Winning Patterns */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
            <Star className="w-5 h-5" />
            Winning Patterns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {winningPatterns.map((pattern, index) => (
              <div key={index} className="border border-white/20 rounded-lg p-3 bg-white/10 backdrop-blur-sm">
                <div className="mb-1">
                  <span className="font-medium text-white">{pattern.name}</span>
                </div>
                <p className="text-sm text-white/90">{pattern.description}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Pro Tips */}
        <div className="bg-purple-500/20 border border-purple-300/30 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-2 text-purple-200">Pro Tips</h3>
          <ul className="space-y-1 text-sm text-purple-100">
            <li>• Watch for multiple patterns simultaneously</li>
            <li>• Use power-ups strategically during busy games</li>
            <li>• Play during peak hours for bigger prize pools</li>
            <li>• Check your balance regularly</li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
};

export default GameInstructions;