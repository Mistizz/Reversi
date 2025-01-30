import React from 'react';
import { Cell } from './Cell';
import { Board as BoardType, Position, Player } from '../types/game';

interface BoardProps {
  board: BoardType;
  validMoves: Position[];
  currentPlayer: Player;
  onCellClick: (row: number, col: number) => void;
}

export const Board: React.FC<BoardProps> = ({ board, validMoves, currentPlayer, onCellClick }) => {
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const handleCellClick = (row: number, col: number) => {
    // コンピュータの手番の場合はクリックを無視
    if (currentPlayer === 'blue') return;
    onCellClick(row, col);
  };

  return (
    <div className="inline-block bg-green-700 p-4 rounded-xl shadow-xl">
      <div className="grid grid-cols-8 gap-1 bg-green-800 p-1">
        {board.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                isValidMove={isValidMove(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={currentPlayer === 'blue'}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}; 