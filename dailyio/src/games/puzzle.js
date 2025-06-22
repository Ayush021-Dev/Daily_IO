import React, { useState, useEffect, useCallback } from 'react';

const SlidingPuzzle = () => {
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [size, setSize] = useState(3); 

  
  const initializeGame = useCallback(() => {
    
    const newBoard = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
    
    
    
    let shuffledBoard = [...newBoard];
    let emptyIndex = size * size - 1;
    
    
    for (let i = 0; i < 1000; i++) {
      const possibleMoves = getValidMoves(shuffledBoard, size);
      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        
        [shuffledBoard[emptyIndex], shuffledBoard[randomMove]] = 
          [shuffledBoard[randomMove], shuffledBoard[emptyIndex]];
        emptyIndex = randomMove;
      }
    }
    
    setBoard(shuffledBoard);
    setMoves(0);
    setGameOver(false);
    setStartTime(Date.now());
    setEndTime(null);
  }, [size]);

  
  const getValidMoves = (currentBoard, gridSize) => {
    const emptyIndex = currentBoard.indexOf(0);
    const row = Math.floor(emptyIndex / gridSize);
    const col = emptyIndex % gridSize;
    const validMoves = [];
    
    
    if (row > 0) validMoves.push(emptyIndex - gridSize);
    
    if (row < gridSize - 1) validMoves.push(emptyIndex + gridSize);
    
    if (col > 0) validMoves.push(emptyIndex - 1);
    
    if (col < gridSize - 1) validMoves.push(emptyIndex + 1);
    
    return validMoves;
  };
  
  
  const checkWin = useCallback((currentBoard) => {
    
    for (let i = 0; i < currentBoard.length - 1; i++) {
      if (currentBoard[i] !== i + 1) return false;
    }
    return currentBoard[currentBoard.length - 1] === 0;
  }, []);

  
  const handleTileClick = (index) => {
    if (gameOver) return;
    
    const emptyIndex = board.indexOf(0);
    
    const validMoves = getValidMoves(board, size);
    
    if (validMoves.includes(index)) {
      
      const newBoard = [...board];
      [newBoard[emptyIndex], newBoard[index]] = [newBoard[index], newBoard[emptyIndex]];
      
      setBoard(newBoard);
      setMoves(moves + 1);
      
      
      if (checkWin(newBoard)) {
        setGameOver(true);
        setEndTime(Date.now());
      }
    }
  };
  
  
  const changeSize = (newSize) => {
    setSize(newSize);
  };
  
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame, size]);

  
  const formatTime = (milliseconds) => {
    if (!milliseconds) return '00:00';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  
  const elapsedTime = endTime 
    ? endTime - startTime 
    : startTime 
      ? Date.now() - startTime 
      : 0;
      const gradientKeyframes = `
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96C93D);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        min-height: 100vh;
      }
  
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
  
  return (
    <div className="puzzle-container">
      <style jsx>{gradientKeyframes}</style>
      <div className="puzzle-header">
        <h2>Sliding Puzzle</h2>
        <div className="puzzle-stats">
          <span>Moves: {moves}</span>
          <span>Time: {formatTime(elapsedTime)}</span>
        </div>
        <div className="puzzle-controls">
          <button 
            className="puzzle-restart-btn"
            onClick={initializeGame}
          >
            Restart Game
          </button>
          <div className="puzzle-difficulty">
            <button 
              onClick={() => changeSize(3)}
              className={`puzzle-size-btn ${size === 3 ? 'active' : ''}`}
            >
              3×3
            </button>
            <button 
              onClick={() => changeSize(4)}
              className={`puzzle-size-btn ${size === 4 ? 'active' : ''}`}
            >
              4×4
            </button>
            <button 
              onClick={() => changeSize(5)}
              className={`puzzle-size-btn ${size === 5 ? 'active' : ''}`}
            >
              5×5
            </button>
          </div>
        </div>
      </div>
      
      {gameOver && (
        <div className="puzzle-victory">
          <h3>Puzzle Solved!</h3>
          <p>You completed the puzzle in {moves} moves and {formatTime(elapsedTime)}!</p>
        </div>
      )}
      
      <div 
        className="puzzle-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {board.map((value, index) => (
          <div
            key={index}
            className={`puzzle-tile ${value === 0 ? 'empty' : ''}`}
            onClick={() => handleTileClick(index)}
          >
            {value !== 0 && value}
          </div>
        ))}
      </div>
      
      
      <style jsx>{`
        .puzzle-container {
        padding-top: 100px;
          max-width: 800px;
          margin: 0 auto;
          font-family: sans-serif;
        }
        
        .puzzle-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .puzzle-header h2 {
          color: white;
          font-size: 28px;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .puzzle-stats {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 18px;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        .puzzle-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .puzzle-difficulty {
          display: flex;
          gap: 10px;
        }
        
        .puzzle-restart-btn {
          background-color:rgb(25, 77, 70);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .puzzle-restart-btn:hover {
          background-color: #00a892;
        }
        
        .puzzle-size-btn {
          background-color: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .puzzle-size-btn:hover {
          background-color: rgba(255, 255, 255, 0.07);
        }
        
        .puzzle-size-btn.active {
          background-color:rgb(36, 134, 124);
          color: white;
        }
        
        .puzzle-grid {
          display: grid;
          gap: 6px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          aspect-ratio: 1/1;
        }
        
        .puzzle-tile {
          background: linear-gradient(135deg, rgb(40, 82, 112), rgb(100, 113, 117));
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        
        .puzzle-tile:hover:not(.empty) {
          transform: scale(0.95);
        }
        
        .puzzle-tile.empty {
          background: none;
          box-shadow: none;
          cursor: default;
        }
        
        .puzzle-victory {
          background-color: rgba(255,255,255,0.2);
          border: 2px solid white;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          text-align: center;
          color: white;
        }
        
        .puzzle-victory h3 {
          color: white;
          margin-top: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        /* Responsive design */
        @media (max-width: 600px) {
          .puzzle-tile {
            font-size: 18px;
          }
        }
        
        @media (max-width: 400px) {
          .puzzle-tile {
            font-size: 16px;
          }
          
          .puzzle-controls {
            flex-direction: column;
            gap: 10px;
          }
          
          .puzzle-difficulty {
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default SlidingPuzzle;