import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Import the background image
import htpbBackground from '/HTPBB-background.jpg';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto p-0 border-none"
        style={{
          background: 'transparent',
          boxShadow: 'none',
          padding: 0
        }}
        aria-describedby="how-to-play-description"
      >
        <div 
          className="p-6 rounded-lg relative"
          style={{
            minHeight: '500px',
            position: 'relative'
          }}
        >
          {/* Background Image Layer */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url('/HTPBB-background.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: -2
            }}
          />
          
          {/* Dark Overlay */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: -1
            }}
          />
          
          {/* Force image load for debugging */}
          <div style={{ display: 'none' }}>
            <img 
              src="/HTPBB-background.jpg" 
              onLoad={() => console.log('✅ HTPBB-background.jpg loaded successfully!')}
              onError={(e) => console.log('❌ HTPBB-background.jpg failed to load:', e)}
            />
          </div>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-white">
              <span>How to Play Bingo</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <div id="how-to-play-description" className="sr-only">
              Learn how to play BingoBest with rules, winning patterns, and power-ups
            </div>
          </DialogHeader>
          
          <div className="space-y-6 text-white">
          {/* Basic Rules */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Basic Rules</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>• Each player gets one or more bingo cards with 25 squares.</li>
              <li>• Numbers are called randomly from 1-75.</li>
              <li>• Mark matching numbers on your card.</li>
              <li>• First to complete a line (horizontal, vertical, or diagonal) wins!</li>
            </ul>
          </div>

          {/* Power-Ups */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Power-Ups</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>• <strong>Auto Daub</strong>: Automatically marks numbers for you.</li>
              <li>• <strong>Extra Ball</strong>: Get an additional number called.</li>
              <li>• <strong>Peek Next</strong>: See the next number to be called.</li>
              <li>• <strong>Double Prize</strong>: Double your winnings if you win.</li>
            </ul>
          </div>

          {/* Winning Patterns */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Winning Patterns</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>• <strong>Horizontal line</strong>: 5 in a row - <span className="text-green-400 font-semibold">$50</span></li>
              <li>• <strong>Vertical line</strong>: 5 in a column - <span className="text-green-400 font-semibold">$50</span></li>
              <li>• <strong>Diagonal line</strong>: 5 from corner to corner - <span className="text-green-400 font-semibold">$75</span></li>
              <li>• <strong>4 Corners</strong>: All four corner squares - <span className="text-green-400 font-semibold">$25</span></li>
              <li>• <strong>X Pattern</strong>: Both diagonal lines - <span className="text-green-400 font-semibold">$150</span></li>
              <li>• <strong>Full house</strong>: All 25 squares marked - <span className="text-green-400 font-semibold">$200</span></li>
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Pro Tips</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>• Pay attention to the called numbers display</li>
              <li>• Use power-ups strategically to increase your chances</li>
              <li>• Multiple cards give you more winning opportunities</li>
              <li>• The center square is always free!</li>
            </ul>
          </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlayModal;
