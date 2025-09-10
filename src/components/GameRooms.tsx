import React from 'react';
import { GameRoom } from '@/types/game';

interface GameRoomsProps {
  rooms: GameRoom[];
  onJoinRoom: (roomId: string) => void;
  playerBalance: number;
}

const GameRooms: React.FC<GameRoomsProps> = ({ rooms, onJoinRoom, playerBalance }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Rooms</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-gray-800">{room.name}</h3>
              <span className={`
                px-2 py-1 rounded-full text-xs font-semibold
                ${room.status === 'waiting' ? 'bg-green-100 text-green-800' : ''}
                ${room.status === 'playing' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${room.status === 'finished' ? 'bg-gray-100 text-gray-800' : ''}
              `}>
                {room.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-semibold">${room.entryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prize Pool:</span>
                <span className="font-semibold text-green-600">${room.prizePool}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Players:</span>
                <span className="font-semibold">{room.currentPlayers}/{room.maxPlayers}</span>
              </div>
            </div>
            
            <button
              onClick={() => onJoinRoom(room.id)}
              disabled={
                room.status !== 'waiting' || 
                room.currentPlayers >= room.maxPlayers ||
                playerBalance < room.entryFee
              }
              className={`
                w-full py-2 px-4 rounded-lg font-semibold transition-colors
                ${room.status === 'waiting' && room.currentPlayers < room.maxPlayers && playerBalance >= room.entryFee
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {room.status !== 'waiting' ? 'Game in Progress' : 
               room.currentPlayers >= room.maxPlayers ? 'Room Full' :
               playerBalance < room.entryFee ? 'Insufficient Funds' : 'Join Game'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameRooms;