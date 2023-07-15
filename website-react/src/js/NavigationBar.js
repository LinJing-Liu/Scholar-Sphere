import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../css/NavigationBar.css';

const Navbar = () => {

  let navigate = useNavigate();
  const navigateToFlashCard = () => {
    navigate('/');
    
    setTimeout(() => {
      const container = document.getElementById("flash-card-page-container");
      container.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Scholar Sphere</Link>
      </div>
      <div className="navbar-right">
        <Link to="/">Home</Link>
        <Link to="/" onClick={navigateToFlashCard}>Flashcards</Link>
        <Link to="/word-list">Word List</Link>
        <Link to="/games">Games</Link>
        <Link to="/statistics">Statistics</Link>
      </div>
    </nav>
  );
};

export default Navbar;