import React from 'react';
import { GameRoom } from '@/types/game';

interface GameRoomsProps {
  rooms: GameRoom[];
  onJoinRoom: (roomId: string) => void;
  playerBalance: number;
}

const GameRooms: React.FC<GameRoomsProps> = ({ rooms, onJoinRoom, playerBalance }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-8 casino-text-glow">Game Rooms</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 lg:p-8 hover:bg-white/15 transition-all duration-300 shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">{room.name}</h3>
              <span className={`
                px-3 py-1 rounded-full text-sm font-semibold
                ${room.status === 'waiting' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                ${room.status === 'playing' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                ${room.status === 'finished' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' : ''}
              `}>
                {room.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-sm">$</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Entry Fee</p>
                  <p className="text-white font-semibold">${room.entryFee}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 text-sm">🏆</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Prize Pool</p>
                  <p className="text-green-400 font-bold text-lg">${room.prizePool}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-sm">👥</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Players</p>
                  <p className="text-white font-semibold">{room.playerCount}/{room.maxPlayers}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 text-sm">⏰</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Time Left</p>
                  <p className="text-blue-400 font-bold">{Math.floor(room.timeLeft / 60)}:{(room.timeLeft % 60).toString().padStart(2, '0')}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onJoinRoom(room.id)}
              disabled={
                room.status !== 'waiting' || 
                room.playerCount >= room.maxPlayers ||
                playerBalance < room.entryFee
              }
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                ${room.status === 'waiting' && room.playerCount < room.maxPlayers && playerBalance >= room.entryFee
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                }
              `}
            >
              {room.status !== 'waiting' ? '🎮 Game in Progress' : 
               room.playerCount >= room.maxPlayers ? '🚫 Room Full' :
               playerBalance < room.entryFee ? '💰 Insufficient Funds' : '🎯 Join Game'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameRooms;