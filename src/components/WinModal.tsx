import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, DollarSign } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  winType: string;
  prize: number;
}

const WinModal: React.FC<WinModalProps> = ({ isOpen, onClose, winType, prize }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-600">
            🎉 BINGO! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          <div className="flex justify-center">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Congratulations!</h3>
            <p className="text-gray-600">You won with a {winType} pattern!</p>
          </div>
          
          <div className="bg-green-100 border border-green-300 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                ${(prize || 0).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">Added to your balance!</p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
              Continue Playing
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinModal;