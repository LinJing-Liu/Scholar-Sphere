import React, { useContext } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { NavLink } from 'react-router-dom';

import LastPageRouteContext from './LastPageRouteContext';

import '../css/NavigationBar.css';

const Navbar = () => {
  const { lastRoute } = useContext(LastPageRouteContext);

  const handleFlashcardsClick = (e) => {
    if (lastRoute !== '/' && lastRoute !== '/#home') {
      e.preventDefault();
      window.location.href = '/#flashcards';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          onClick={() => window.scrollTo(0, 0)}
          smooth
          to="/#home"
        >
          ScholarSphere
        </Link>
      </div>
      <div className="navbar-right">
        <Link
          onClick={() => window.scrollTo(0, 0)}
          smooth
          to="/#home"
        >
          Home
        </Link>
        <Link
          smooth
          to="/#flashcards"
        >
          Flashcards
        </Link>
        <NavLink
          onClick={() => window.scrollTo(0, 0)}
          to="/word-list"
        >
          Word List
        </NavLink>
        <NavLink
          onClick={() => window.scrollTo(0, 0)}
          to="/games"
        >
          Games
        </NavLink>
        <NavLink
          onClick={() => window.scrollTo(0, 0)}
          to="/statistics"
        >
          Statistics
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
