import { useState, useCallback, useEffect } from 'react';
import type { Board, Player, Position } from '../types/game';

const BOARD_SIZE = 8;
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

const createInitialBoard = (): Board => {
  const board: Board = Array(BOARD_SIZE).fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  
  // 初期配置
  const center = BOARD_SIZE / 2;
  board[center - 1][center - 1] = 'blue';
  board[center - 1][center] = 'red';
  board[center][center - 1] = 'red';
  board[center][center] = 'blue';
  
  return board;
};

const countPieces = (board: Board): { redCount: number; blueCount: number } => {
  let redCount = 0;
  let blueCount = 0;
  
  board.forEach(row => {
    row.forEach(cell => {
      if (cell === 'red') redCount++;
      if (cell === 'blue') blueCount++;
    });
  });
  
  return { redCount, blueCount };
};

type MoveScore = {
  position: Position;
  score: number;
};

export interface GameState {
  board: Board;
  currentPlayer: Player;
  redCount: number;
  blueCount: number;
  isGameOver: boolean;
  validMoves: Position[];
  winner: Player | 'draw' | null;
  lastComputerMove?: string;
}

export const useOthello = () => {
  const isValidPosition = useCallback((row: number, col: number): boolean => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }, []);

  const getFlippablePieces = useCallback((row: number, col: number, player: Player, board: Board): Position[] => {
    if (board[row][col] !== null) return [];
    
    const flippablePieces: Position[] = [];
    const opponent: Player = player === 'red' ? 'blue' : 'red';

    DIRECTIONS.forEach(([dRow, dCol]) => {
      let currentRow = row + dRow;
      let currentCol = col + dCol;
      const temp: Position[] = [];

      while (
        isValidPosition(currentRow, currentCol) &&
        board[currentRow][currentCol] === opponent
      ) {
        temp.push({ row: currentRow, col: currentCol });
        currentRow += dRow;
        currentCol += dCol;
      }

      if (
        temp.length > 0 &&
        isValidPosition(currentRow, currentCol) &&
        board[currentRow][currentCol] === player
      ) {
        flippablePieces.push(...temp);
      }
    });

    return flippablePieces;
  }, [isValidPosition]);

  const findValidMoves = useCallback((board: Board, player: Player): Position[] => {
    const validMoves: Position[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (getFlippablePieces(row, col, player, board).length > 0) {
          validMoves.push({ row, col });
        }
      }
    }
    
    return validMoves;
  }, [getFlippablePieces]);

  const calculateMoveScore = useCallback((row: number, col: number, player: Player, board: Board): number => {
    const flippablePieces = getFlippablePieces(row, col, player, board);
    return flippablePieces.length;
  }, [getFlippablePieces]);

  const getBestMoves = useCallback((board: Board, player: Player): MoveScore[] => {
    const validMoves = findValidMoves(board, player);
    const scoredMoves: MoveScore[] = validMoves.map(move => ({
      position: move,
      score: calculateMoveScore(move.row, move.col, player, board)
    }));

    // スコアの高い順にソート
    return scoredMoves.sort((a, b) => b.score - a.score);
  }, [findValidMoves, calculateMoveScore]);

  const getComputerMove = useCallback((board: Board, player: Player): { position: Position; moveType: string } | null => {
    const bestMoves = getBestMoves(board, player);
    if (bestMoves.length === 0) return null;

    const random = Math.random();
    if (random < 0.75 && bestMoves.length >= 1) {
      // 75%の確率で最善手
      return { position: bestMoves[0].position, moveType: 'Best Move' };
    } else if (random < 0.95 && bestMoves.length >= 2) {
      // 20%の確率で2番目
      return { position: bestMoves[1].position, moveType: '2nd Best Move' };
    } else if (bestMoves.length >= 3) {
      // 5%の確率で3番目
      return { position: bestMoves[2].position, moveType: '3rd Best Move' };
    }
    // 選択肢が少ない場合は最善手を選択
    return { position: bestMoves[0].position, moveType: 'Best Move (No other choice)' };
  }, [getBestMoves]);

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialBoard = createInitialBoard();
    const initialValidMoves = findValidMoves(initialBoard, 'red');
    return {
      board: initialBoard,
      currentPlayer: 'red',
      redCount: 2,
      blueCount: 2,
      isGameOver: false,
      validMoves: initialValidMoves,
      winner: null,
      lastComputerMove: undefined
    };
  });

  const makeMove = useCallback((row: number, col: number) => {
    if (gameState.isGameOver) return;
    
    const flippablePieces = getFlippablePieces(row, col, gameState.currentPlayer, gameState.board);
    if (flippablePieces.length === 0) return;

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = gameState.currentPlayer;
    
    flippablePieces.forEach(({ row, col }) => {
      newBoard[row][col] = gameState.currentPlayer;
    });

    const nextPlayer: Player = gameState.currentPlayer === 'red' ? 'blue' : 'red';
    const { redCount, blueCount } = countPieces(newBoard);
    const validMoves = findValidMoves(newBoard, nextPlayer);
    
    const currentPlayerValidMoves = validMoves.length === 0 ? 
      findValidMoves(newBoard, gameState.currentPlayer) : [];
    
    const isGameOver = validMoves.length === 0 && currentPlayerValidMoves.length === 0;
    const nextValidMoves = validMoves.length > 0 ? validMoves : currentPlayerValidMoves;
    const actualNextPlayer = validMoves.length > 0 ? nextPlayer : gameState.currentPlayer;

    let winner: Player | 'draw' | null = null;
    if (isGameOver) {
      if (redCount > blueCount) winner = 'red';
      else if (blueCount > redCount) winner = 'blue';
      else winner = 'draw';
    }

    setGameState({
      board: newBoard,
      currentPlayer: actualNextPlayer,
      redCount,
      blueCount,
      isGameOver,
      validMoves: nextValidMoves,
      winner,
      lastComputerMove: gameState.lastComputerMove
    });
  }, [gameState, getFlippablePieces, findValidMoves]);

  // コンピュータの手を管理するeffect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!gameState.isGameOver && gameState.currentPlayer === 'blue') {
      const computerMove = getComputerMove(gameState.board, 'blue');
      if (computerMove) {
        timer = setTimeout(() => {
          console.log(`AI Move: ${computerMove.moveType}`);
          setGameState(prev => ({
            ...prev,
            lastComputerMove: computerMove.moveType
          }));
          makeMove(computerMove.position.row, computerMove.position.col);
        }, 1000);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameState, getComputerMove, makeMove]);

  const resetGame = useCallback(() => {
    const initialBoard = createInitialBoard();
    const validMoves = findValidMoves(initialBoard, 'red');
    setGameState({
      board: initialBoard,
      currentPlayer: 'red',
      redCount: 2,
      blueCount: 2,
      isGameOver: false,
      validMoves,
      winner: null,
      lastComputerMove: undefined
    });
  }, [findValidMoves]);

  return {
    gameState,
    makeMove,
    resetGame
  };
}; 