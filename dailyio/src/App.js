import React from "react";
import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import Home from "./home";
import Dashboard from "./dashboard";
import Login from "./login";
import Signup from "./signup";
import Navbar from "./components/navbar";
import AboutUs from "./aboutus";
import Todo from "./todo";
import Games from "./games";
import Weather from "./weather";
import BrickBreaker from "./games/brick";
import WhackAMole from "./games/whack";
import Snake from "./games/snake";
import Game2048 from "./games/2048";
import MemoryMatch from "./games/memory";
import SlidingPuzzle from "./games/puzzle";
import PingPong from "./games/pingpong";
import Tetris from "./games/tetris";
import Stock from "./stock";
import News from "./news";
import CurrencyConverter from "./currencyconverter";
import UnitConverter from "./unitconverter";

const NavbarWrapper = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="with-navbar">
        {children}
      </main>
    </>
  );
};
const NoNavbarWrapper = ({ children }) => {
  return <main>{children}</main>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without navbar */}
        <Route path="/" element={<NoNavbarWrapper><Home /></NoNavbarWrapper>} />
        <Route path="/login" element={<NoNavbarWrapper><Login /></NoNavbarWrapper>} />
        <Route path="/signup" element={<NoNavbarWrapper><Signup /></NoNavbarWrapper>} />
        {/* Routes with navbar */}
        <Route path="/dashboard" element={<NavbarWrapper><Dashboard /></NavbarWrapper>} />
        <Route path="/todo" element={<NavbarWrapper><Todo /></NavbarWrapper>} />
        <Route path="/aboutus" element={<NavbarWrapper><AboutUs /></NavbarWrapper>} />
        <Route path="/Games" element={<NavbarWrapper><Games /></NavbarWrapper>} />
        <Route path="/weather" element={<NavbarWrapper><Weather /></NavbarWrapper>} /> 
        <Route path="/games/brick" element={<NavbarWrapper><BrickBreaker /></NavbarWrapper>} />
        <Route path="/games/whack" element={<NavbarWrapper><WhackAMole /></NavbarWrapper>} />
        <Route path="/games/snake" element={<NavbarWrapper><Snake /></NavbarWrapper>} />
        <Route path="/games/2048" element={<NavbarWrapper><Game2048 /></NavbarWrapper>} />
        <Route path="/games/tetris" element={<NavbarWrapper><Tetris /></NavbarWrapper>} />
        <Route path="/games/memory" element={<NavbarWrapper><MemoryMatch /></NavbarWrapper>} />
        <Route path="/games/puzzle" element={<NavbarWrapper><SlidingPuzzle /></NavbarWrapper>} />
        <Route path="/games/pingpong" element={<NavbarWrapper><PingPong /></NavbarWrapper>} />
        <Route path="/stock" element={<NavbarWrapper><Stock /></NavbarWrapper>} />
        <Route path="/news" element={<NavbarWrapper><News /></NavbarWrapper>} />
        <Route path="/currencyconverter" element={<NavbarWrapper><CurrencyConverter /></NavbarWrapper>} />
        <Route path="/unitconverter" element={<NavbarWrapper><UnitConverter /></NavbarWrapper>} />
        
      </Routes>
    </Router>
  );
}

export default App;