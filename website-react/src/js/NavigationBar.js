import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import '../css/NavigationBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a to="/#home" onClick={() => {window.location.href="/#home"}}>
          ScholarSphere
        </a>
      </div>
      <div className="navbar-right">
        <a to="/#home" onClick={() => {window.location.href="/#home"}}>
          Home
        </a>
        <HashLink to="/#flashcards">
          Flashcards
        </HashLink>
        <a to="/word-list" onClick={() => {window.location.href="/word-list"}}>
          Word List
        </a>
        <a to="/game-page" onClick={() => {window.location.href="/game-page"}}>
          Games
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
