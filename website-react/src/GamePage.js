import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

const GamePage = ({ words }) => {
  return <div>
    Start GamesPage
    <Game words={words} />
    End GamesPage
  </div>;
};

function Game({ words }) {
  const [currentWord, setCurrentWord] = useState({});
  const [score, setScore] = useState(0);
  const [inputWord, setInputWord] = useState('');

  // Initialize game with random word
  React.useEffect(() => {
    chooseRandomWord();
  }, []);

  function chooseRandomWord() {
    const wordsWithDefinitions = words.filter(word => word.definition && word.definition.trim() !== '');
    if (wordsWithDefinitions.length > 0) {
      const randomWord = wordsWithDefinitions[Math.floor(Math.random() * wordsWithDefinitions.length)];
      setCurrentWord(randomWord);
    } else {
      console.log('No words with definitions found.');
    }
  }





  function handleInputChange(event) {
    setInputWord(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (inputWord.toLowerCase() === currentWord.word.toLowerCase()) {
      setScore(score + 1);
    }
    chooseRandomWord();
    setInputWord('');
  }

  return (
    <div>
      <h1>Word Game</h1>
      <h2>Score: {score}</h2>
      <p>Definition: {currentWord.definition}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputWord}
          onChange={handleInputChange}
          placeholder="Type the word here"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );



}


export default GamePage;