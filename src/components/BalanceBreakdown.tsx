import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Gift, DollarSign, Eye, EyeOff } from 'lucide-react';

interface BalanceBreakdownProps {
  totalBalance: number;
  withdrawableBalance: number;
  bonusBalance: number;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

const BalanceBreakdown: React.FC<BalanceBreakdownProps> = ({
  totalBalance,
  withdrawableBalance,
  bonusBalance,
  className = '',
  showDetails = true,
  compact = false
}) => {
  const [showBreakdown, setShowBreakdown] = React.useState(showDetails);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <Wallet className="w-4 h-4 text-green-400" />
          <span className="font-bold text-white">${totalBalance.toFixed(2)}</span>
        </div>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {showBreakdown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        {showBreakdown && (
          <div className="flex gap-2 text-xs">
            <span className="text-green-300">${withdrawableBalance.toFixed(2)} WD</span>
            <span className="text-yellow-300">${bonusBalance.toFixed(2)} B</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-white">Account Balance</h3>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showBreakdown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-3">
          {/* Total Balance */}
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              ${totalBalance.toFixed(2)}
            </div>
            <p className="text-sm text-gray-300">Total Available Funds</p>
          </div>

          {showBreakdown && (
            <div className="space-y-2">
              {/* Withdrawable Balance */}
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Withdrawable</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    ${withdrawableBalance.toFixed(2)}
                  </div>
                  <Badge variant="outline" className="text-green-300 border-green-400/50 text-xs">
                    Real Money
                  </Badge>
                </div>
              </div>

              {/* Bonus Balance */}
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Bonus Credits</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-400">
                    ${bonusBalance.toFixed(2)}
                  </div>
                  <Badge variant="outline" className="text-yellow-300 border-yellow-400/50 text-xs">
                    Gameplay Only
                  </Badge>
                </div>
              </div>

              {/* Usage Info */}
              <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-600">
                💡 Both funds can be used for entry fees and store purchases
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceBreakdown;
