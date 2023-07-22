import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
//import { Link } from "react-scroll";

import '../css/NavigationBar.css';

const Navbar = () => {

  let navigate = useNavigate();
  const location = useLocation();

  const navigateToFlashCard = () => {
    // Only scroll if we're coming from the home page
    if (location.pathname === "/") {
      const container = document.getElementById("flash-card-page-container");
      container && container.scrollIntoView({ behavior: 'smooth' });

      // Navigate after a delay
      setTimeout(() => {
        navigate('/flashcards');
      }, 1000);  // Adjust this delay as needed
    }
    else {
      console.log('not from /')
      setTimeout(() => {
        navigate('/flashcards');
      }, 1000);
    }
  }
  const navigateToWelcome = () => {
    navigate('/');

    setTimeout(() => { // Added timeout to make sure DOM is updated before we try to access the container
      const container = document.getElementById("hero");
      if (container) {
        // Only scroll if we're coming from the home page
        if (location.pathname === "/") {
          container.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log('not from /');
          container.scrollIntoView({ behavior: 'auto' });
        }
      }
    }, 200);
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Scholar Sphere</Link>
      </div>
      <div className="navbar-right">
        <Link to="/" onClick={navigateToWelcome}>Home</Link>
        <Link to="/" onClick={navigateToFlashCard}>Flashcards</Link>
        <Link to="/word-list">Word List</Link>
        <Link to="/games">Games</Link>
        <Link to="/statistics">Statistics</Link>
      </div>
    </nav>
  );
};

export default Navbar;