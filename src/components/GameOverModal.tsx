import React from 'react';
import { Player } from '../types/game';
import Bitcoin from '../assets/Bitcoin.png';
import BaseNetwork from '../assets/Base_Network.png';

interface GameOverModalProps {
  isOpen: boolean;
  winner: Player | 'draw' | null;
  redCount: number;
  blueCount: number;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  redCount,
  blueCount,
  onClose,
}) => {
  if (!isOpen) return null;

  const getMessage = () => {
    if (winner === 'red') return 'Base Wins!';
    if (winner === 'blue') return 'BTC Wins!';
    if (winner === 'draw') return 'Draw!';
    return 'Game Over';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all">
        <h2 className="text-3xl font-bold text-center mb-6">{getMessage()}</h2>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={BaseNetwork} alt="Base" className="w-6 h-6" />
              <span className="text-lg">Base: {redCount} pieces</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={Bitcoin} alt="BTC" className="w-6 h-6" />
              <span className="text-lg">BTC: {blueCount} pieces</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}; 