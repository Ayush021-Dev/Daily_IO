import React, { useState, useEffect, useRef } from 'react';

const PingPong = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const canvasRef = useRef(null);
  
  const PADDLE_HEIGHT = 80;
  const PADDLE_WIDTH = 10;
  const BALL_RADIUS = 8;
  const WINNING_SCORE = 5;
  
  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 2;
    
    let playerPaddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;
    let computerPaddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      playerPaddleY = mouseY - (PADDLE_HEIGHT / 2);
      
      if (playerPaddleY < 0) {
        playerPaddleY = 0;
      }
      if (playerPaddleY > canvas.height - PADDLE_HEIGHT) {
        playerPaddleY = canvas.height - PADDLE_HEIGHT;
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    const gameLoop = setInterval(() => {
      ctx.fillStyle = 'rgba(73, 209, 190, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.setLineDash([5, 15]);
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, playerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(canvas.width - PADDLE_WIDTH, computerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
      
      ctx.beginPath();
      ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      
      ballX += ballSpeedX;
      ballY += ballSpeedY;
      
      if (ballY < BALL_RADIUS || ballY > canvas.height - BALL_RADIUS) {
        ballSpeedY = -ballSpeedY;
      }
      
      const computerSpeed = 4;
      const computerCenter = computerPaddleY + (PADDLE_HEIGHT / 2);
      if (computerCenter < ballY - 35) {
        computerPaddleY += computerSpeed;
      } else if (computerCenter > ballY + 35) {
        computerPaddleY -= computerSpeed;
      }
      
      if (
        ballX < PADDLE_WIDTH + BALL_RADIUS && 
        ballY > playerPaddleY && 
        ballY < playerPaddleY + PADDLE_HEIGHT
      ) {
        ballSpeedX = -ballSpeedX;
        const deltaY = ballY - (playerPaddleY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25;
      }
      
      if (
        ballX > canvas.width - PADDLE_WIDTH - BALL_RADIUS && 
        ballY > computerPaddleY &&
        ballY < computerPaddleY + PADDLE_HEIGHT
      ) {
        ballSpeedX = -ballSpeedX;
        const deltaY = ballY - (computerPaddleY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25;
      }
      
      if (ballX < 0) {
        const newScore = { ...score, computer: score.computer + 1 };
        setScore(newScore);
        
        if (newScore.computer >= WINNING_SCORE) {
          setGameOver(true);
          setWinner('Computer');
          clearInterval(gameLoop);
        } else {
          resetBall();
        }
      }
      
      if (ballX > canvas.width) {
        const newScore = { ...score, player: score.player + 1 };
        setScore(newScore);
        
        if (newScore.player >= WINNING_SCORE) {
          setGameOver(true);
          setWinner('Player');
          clearInterval(gameLoop);
        } else {
          resetBall();
        }
      }
      
      ctx.font = '24px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(score.player.toString(), canvas.width / 4, 30);
      ctx.fillText(score.computer.toString(), 3 * canvas.width / 4, 30);
      
    }, 1000 / 60); 
    
    const resetBall = () => {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedY = 2;
      ballSpeedX = ballSpeedX > 0 ? 5 : -5;
    };
    
    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameStarted, score]);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false); 
    setScore({ player: 0, computer: 0 });
    setWinner('');
  };
  
  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore({ player: 0, computer: 0 });
    setWinner('');
    setTimeout(() => {
      setGameStarted(true);
    }, 100);
  };
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
    <div className="pingpong-container">
      <style jsx>{gradientKeyframes}</style>
      <div className="pingpong-header">
        <h2>Ping Pong</h2>
        <p>Control your paddle with the mouse to defeat the computer</p>
      </div>
      
      {!gameStarted && !gameOver && (
        <div className="pingpong-start-screen">
          <button onClick={startGame} className="pingpong-button">
            Start Game
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="pingpong-game-over">
          <h3>{winner === 'Player' ? 'You Win!' : 'Computer Wins!'}</h3>
          <p>Final Score: {score.player} - {score.computer}</p>
          <button onClick={restartGame} className="pingpong-button">
            Play Again
          </button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={400}
        className={`pingpong-canvas ${gameStarted && !gameOver ? 'pingpong-active' : ''}`}
      />
      
      <style jsx>{`
        .pingpong-container {
        padding-top:100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
          color: white;
        }
        
        .pingpong-header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .pingpong-header h2 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        .pingpong-header p {
          font-size: 16px;
          opacity: 0.8;
        }
        
        .pingpong-canvas {
          background: linear-gradient(to right, rgba(29, 77, 70, 0.23), rgba(59, 67, 97, 0.75));
          border-radius: 10px;
          display: none;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .pingpong-active {
          display: block;
        }
        
        .pingpong-start-screen, .pingpong-game-over {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to right, rgba(73, 209, 190, 0.8), rgba(93, 129, 255, 0.8));
          width: 700px;
          height: 400px;
          border-radius: 10px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .pingpong-game-over h3 {
          font-size: 32px;
          margin-bottom: 15px;
        }
        
        .pingpong-game-over p {
          font-size: 22px;
          margin-bottom: 25px;
        }
        
        .pingpong-button {
          background-color: #FFD700;
          color: #333;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .pingpong-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .pingpong-button:active {
          transform: translateY(1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default PingPong;