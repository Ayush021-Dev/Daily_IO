import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbarPaths = ["/", "/login", "/signup"];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="navbar-logo">
          <Link to="../">
            <h1>Daily<span>IO</span></h1>
          </Link>
        </div>

         <div className="navbar-menu-icon" onClick={toggleMenu}>
          <div className={isMenuOpen ? "hamburger active" : "hamburger"}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className={isMenuOpen ? "navbar-links active" : "navbar-links"}>
          <ul>
            <li>
              <Link to=".." onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}>Back</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/todo">To-do List</Link>
            </li>
            <li>
              <Link to="/aboutus">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Auth Buttons */}
        <div className={isMenuOpen ? "navbar-auth active" : "navbar-auth"}>
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;