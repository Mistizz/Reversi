import React from 'react';
import { CellValue } from '../types/game';
import Bitcoin from '../assets/Bitcoin.png';
import BaseNetwork from '../assets/Base_Network.png';

interface CellProps {
  value: CellValue;
  isValidMove: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ value, isValidMove, disabled, onClick }) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative
        w-12 h-12
        flex items-center justify-center
        cursor-${disabled ? 'not-allowed' : 'pointer'}
        transition-all duration-200
        ${isValidMove && !disabled ? 'bg-green-500 hover:bg-green-400' : 'bg-green-600 hover:bg-green-500'}
      `}
    >
      {value && (
        <img
          src={value === 'red' ? BaseNetwork : Bitcoin}
          alt={`${value} piece`}
          className={`
            absolute
            w-10 h-10
            transform transition-all duration-300 ease-in-out
            ${isValidMove ? 'scale-0' : 'scale-100'}
          `}
        />
      )}
      {isValidMove && !value && !disabled && (
        <div className="absolute w-4 h-4 rounded-full bg-green-400 opacity-60" />
      )}
    </div>
  );
}; 