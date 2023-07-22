import React, { useEffect, useState, useContext } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

import Navbar from './NavigationBar';
import FlashCardPage from './FlashCardPage.js';
import '../css/HomePage.css';

const HomePage = ({ words, tags }) => {
  return (
    <div>
      <Navbar />
      <div id="home">
        <div id="hero">
          <div className='welcome-wrapper'>
            <Welcome />
          </div>
          <div className="arrow"></div>
        </div>

      </div>

      <div id="flashcards">
        <FlashCardPage words={words} tags={tags} />
      </div>
    </div>
  );
};



function Welcome() {
  return (
    <div className='welcome'>
      <h1>Welcome</h1>
      <p>Let's start studying!</p>
    </div>
  )
}

export default HomePage;