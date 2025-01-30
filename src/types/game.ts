export type CellValue = 'red' | 'blue' | null;
export type Player = 'red' | 'blue';
export type Board = CellValue[][];
export type Position = {
  row: number;
  col: number;
};

export interface GameState {
  board: Board;
  currentPlayer: Player;
  redCount: number;
  blueCount: number;
  isGameOver: boolean;
  validMoves: Position[];
  winner: Player | 'draw' | null;
} 