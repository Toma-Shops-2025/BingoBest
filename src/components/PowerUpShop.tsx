import React from 'react';
import { PowerUp } from '@/types/game';

interface PowerUpShopProps {
  powerUps: PowerUp[];
  playerBalance: number;
  onPurchase: (powerUpId: string) => void;
}

const PowerUpShop: React.FC<PowerUpShopProps> = ({ 
  powerUps, 
  playerBalance, 
  onPurchase 
}) => {
  const powerUpIcon = "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515333110_afd4e08b.webp";

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Power-Ups</h3>
      <div className="space-y-3">
        {powerUps.map((powerUp) => (
          <div
            key={powerUp.id}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border"
          >
            <div className="flex items-center space-x-3">
              <img 
                src={powerUpIcon} 
                alt={powerUp.name}
                className="w-8 h-8"
              />
              <div>
                <h4 className="font-semibold text-sm">{powerUp.name}</h4>
                <p className="text-xs text-gray-600">{powerUp.description}</p>
              </div>
            </div>
            <button
              onClick={() => onPurchase(powerUp.id)}
              disabled={playerBalance < powerUp.cost}
              className={`
                px-3 py-1 rounded-lg text-sm font-semibold transition-colors
                ${playerBalance >= powerUp.cost
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              ${powerUp.cost}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PowerUpShop;