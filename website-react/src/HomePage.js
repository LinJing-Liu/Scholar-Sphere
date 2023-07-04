import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import './App.js';

const HomePage = () => {
  return <div>
    Start HomePage
    <Welcome />
    End HomePage
  </div>;
};

function Welcome() {
  return (
    <div className='welcome'>
      Welcome!
    </div>
  )
}

export default HomePage;