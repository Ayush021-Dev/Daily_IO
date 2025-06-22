import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./games.css"; 
import BrickBreaker from "./games/brick"; 
import WhackAMole from './games/whack';
import Snake from './games/snake';
import Game2048 from './games/2048';
import Tetris from './games/tetris';
import MemoryMatch from './games/memory';
import SlidingPuzzle from "./games/puzzle";
import PingPong from "./games/pingpong";

const GamesHome = () => {
  const [hovered, setHovered] = useState(null);

  const games = [
    { id: 1, name: "Brick Breaker", description: "Break all the bricks!", path: "/games/brick", video: "/videos/brick.mp4" },
    { id: 2, name: "Memory Match", description: "Test your memory skills", path: "/games/memory", video: "/videos/memory.mp4" },
    { id: 3, name: "Snake Game", description: "Classic snake challenge", path: "/games/snake", video: "/videos/snake.mp4" },
    { id: 4, name: "Whack-A-Mole", description: "Whack moles as fast as you can", path: "/games/whack", video: "/videos/whack.mp4" },
    { id: 5, name: "Tetris", description: "The classic game of Tetris", path: "/games/tetris", video: "/videos/tetris.mp4" },
    { id: 6, name: "2048", description: "Combine tiles to reach 2048", path: "/games/2048", video: "/videos/2048.mp4" },
    { id: 7, name: "Puzzle", description: "Slide the blocks in minimum moves", path: "/games/puzzle", video: "/videos/puzzle.mp4" },
    { id: 8, name: "Ping Pong", description: "2D Table tennis", path: "/games/pingpong", video: "/videos/pingpong.mp4" },
  ];

  return (
    <div className="games-page">
      <div className="games-container">
        <div className="games-content">
          <h1 className="games-header">Mini Games</h1>

          <div className="games-grid">
            {games.map((game) => (
              <div
                key={game.id}
                className="game-card"
                onMouseEnter={() => setHovered(game.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ position: "relative" }}
              >
                <Link to={game.path || `/games/${game.id}`}>
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                </Link>
                {hovered === game.id && (
                  <div className="game-preview-overlay">
                    <video
                      src={game.video}
                      autoPlay
                      loop
                      muted
                      className="game-preview-video"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Games = () => {
  return (
    <Routes>
      <Route path="/" element={<GamesHome />} />
      <Route path="/games/brick" element={<BrickBreaker />} />
      <Route path="/games/whack" element={<WhackAMole />} />
      <Route path="/games/snake" element={<Snake />} />
      <Route path="/games/2048" element={<Game2048 />} />
      <Route path="/games/tetris" element={<Tetris />} />
      <Route path="/games/memory" element={<MemoryMatch />} />
      <Route path="/games/puzzle" element={<SlidingPuzzle />} />
      <Route path="/games/pingpong" element={<PingPong />} />
    </Routes>
  );
};

export default Games;