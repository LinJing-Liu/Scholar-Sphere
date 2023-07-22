import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { NavLink } from 'react-router-dom';

import '../css/NavigationBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link smooth to="/#home">
          ScholarSphere
        </Link>
      </div>
      <div className="navbar-right">
        {/* <NavLink to="/">
          Home
        </NavLink>
        <NavLink to="/flashcards">
          Flashcards
        </NavLink><NavLink to="/games">
          Games
        </NavLink> */}
        <Link smooth to="/#home">
          Home
        </Link>
        <Link smooth to="/#flashcards">
          Flashcards
        </Link>
        <NavLink to="/word-list">
          Word List
        </NavLink>
        <NavLink to="/games">
          Games
        </NavLink><NavLink to="/statistics">
          Statistics
        </NavLink>

      </div>
    </nav>
  );
};

export default Navbar;