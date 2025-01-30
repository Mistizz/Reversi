import React from 'react';
import { Player } from '../types/game';

interface GameInfoProps {
  currentPlayer: Player;
  redCount: number;
  blueCount: number;
  isGameOver: boolean;
  winner: Player | 'draw' | null;
  lastComputerMove?: string;
  onReset: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  currentPlayer,
  redCount,
  blueCount,
  isGameOver,
  winner,
  lastComputerMove,
  onReset,
}) => {
  const getGameStatus = () => {
    if (isGameOver) {
      if (winner === 'red') return 'Red Wins!';
      if (winner === 'blue') return 'Blue Wins!';
      if (winner === 'draw') return 'Draw!';
      return 'Game Over';
    }
    const playerColor = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    return `${playerColor}'s Turn`;
  };

  return (
    <div className="w-full text-center">
      <div className="mb-6">
        <div className="text-2xl font-bold mb-4 text-gray-800">{getGameStatus()}</div>
        {lastComputerMove && (
          <div className="text-lg mb-4 text-blue-600">
            Computer's Last Move: {lastComputerMove}
          </div>
        )}
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-600 rounded-full shadow-md"></div>
            <span className="text-lg font-medium text-gray-700">{redCount} pieces</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full shadow-md"></div>
            <span className="text-lg font-medium text-gray-700">{blueCount} pieces</span>
          </div>
        </div>
      </div>
      <button
        onClick={onReset}
        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md"
      >
        Reset Game
      </button>
    </div>
  );
}; 