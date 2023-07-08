import React, { useEffect, useState, useContext } from 'react';
import './App.css';
import { HashLink as Link } from 'react-router-hash-link';

const HomePage = () => {
  return <div>
    Start HomePage
    <div className='welcome-wrapper'>
      <Welcome />

    </div>
    <div className="arrow"></div>
    End HomePage
  </div>;
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