import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>How to Play Bingo</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Rules */}
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-3">Basic Rules</h3>
            <ul className="space-y-2 text-sm">
              <li>• Each player gets one or more bingo cards with 25 squares.</li>
              <li>• Numbers are called randomly from 1-75.</li>
              <li>• Mark matching numbers on your card.</li>
              <li>• First to complete a line (horizontal, vertical, or diagonal) wins!</li>
            </ul>
          </div>

          {/* Power-Ups */}
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-3">Power-Ups</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Auto Daub</strong>: Automatically marks numbers for you.</li>
              <li>• <strong>Extra Ball</strong>: Get an additional number called.</li>
              <li>• <strong>Peek Next</strong>: See the next number to be called.</li>
              <li>• <strong>Double Prize</strong>: Double your winnings if you win.</li>
            </ul>
          </div>

          {/* Winning Patterns */}
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-3">Winning Patterns</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Horizontal line</strong>: 5 in a row - <span className="text-green-600 font-semibold">$50</span></li>
              <li>• <strong>Vertical line</strong>: 5 in a column - <span className="text-green-600 font-semibold">$50</span></li>
              <li>• <strong>Diagonal line</strong>: 5 from corner to corner - <span className="text-green-600 font-semibold">$75</span></li>
              <li>• <strong>4 Corners</strong>: All four corner squares - <span className="text-green-600 font-semibold">$25</span></li>
              <li>• <strong>X Pattern</strong>: Both diagonal lines - <span className="text-green-600 font-semibold">$150</span></li>
              <li>• <strong>Full house</strong>: All 25 squares marked - <span className="text-green-600 font-semibold">$200</span></li>
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-3">Pro Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>• Pay attention to the called numbers display</li>
              <li>• Use power-ups strategically to increase your chances</li>
              <li>• Multiple cards give you more winning opportunities</li>
              <li>• The center square is always free!</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlayModal;
