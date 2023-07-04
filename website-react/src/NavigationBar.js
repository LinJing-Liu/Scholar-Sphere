import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">ScholarSphere</Link>
      </div>
      <div className="navbar-right">
        <Link to="/">Home</Link>
        <a href="#flashcards">Flashcards</a>
        <Link to="/word-list">Word List</Link>
        <Link to="/games">Games</Link>
        <Link to="/statistics">Statistics</Link>
      </div>
    </nav>
  );
};

export default Navbar;