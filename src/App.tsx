import { useEffect } from 'react'
import { Board } from './components/Board'
import { GameInfo } from './components/GameInfo'
import { GameOverModal } from './components/GameOverModal'
import { useOthello } from './hooks/useOthello'

function App() {
  const { gameState, makeMove, resetGame } = useOthello();

  useEffect(() => {
    resetGame();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Reversi Game</h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center gap-8">
              <Board
                board={gameState.board}
                validMoves={gameState.validMoves}
                currentPlayer={gameState.currentPlayer}
                onCellClick={makeMove}
              />
              <GameInfo
                currentPlayer={gameState.currentPlayer}
                redCount={gameState.redCount}
                blueCount={gameState.blueCount}
                isGameOver={gameState.isGameOver}
                winner={gameState.winner}
                lastComputerMove={gameState.lastComputerMove}
                onReset={resetGame}
              />
            </div>
          </div>
        </div>
      </div>
      <GameOverModal
        isOpen={gameState.isGameOver}
        winner={gameState.winner}
        redCount={gameState.redCount}
        blueCount={gameState.blueCount}
        onClose={resetGame}
      />
    </div>
  )
}

export default App
