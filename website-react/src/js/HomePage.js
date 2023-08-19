import React, { useEffect, useState, useContext } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

import Navbar from './NavigationBar';
import FlashCardPage from './FlashCardPage.js';
import '../css/HomePage.css';

const HomePage = ({ words, tags, setWords }) => {
  return (
    <div>
      <Navbar />
      <div id="home">
        <div id="hero">
          <div className='welcome-wrapper'>
            <Welcome />
          </div>
          <div className="arrow" onClick={() => {window.location.href="/#flashcards"}}></div>
        </div>

      </div>

      <div id="flashcards">
        <FlashCardPage words={words} tags={tags} setWords={setWords} />
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