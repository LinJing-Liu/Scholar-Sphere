import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import ReactDOM from "react-dom";

const GamePage = ({ words }) => {

  return <div>
    Start GamesPage
    <TypeWord words={words} />
    <MultipleChoice words={words} />
    End GamesPage
  </div>;
};

function TypeWord({ words }) {
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
      <h1>Type the Word Game</h1>
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


const MultipleChoice = ({ words }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    // Remove applied classes from choices
    options.forEach((option, index) => {
      const element = document.getElementById(`option-${index}`);
      element.classList.remove('correct');
      element.classList.remove('wrong');
    });

    // Randomly select a word
    const word = words[Math.floor(Math.random() * words.length)];
    setSelectedWord(word);

    // Get 4 other random words for options
    const otherWords = words.filter(w => w !== word);
    const randomOptions = shuffleArray(otherWords).slice(0, 3);
    randomOptions.push(word);

    // Shuffle the options
    setOptions(shuffleArray(randomOptions));
  };
  const shuffleArray = (array) => {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleOptionClick = (option, index) => {
    if (option === selectedWord) {
      // Correct answer
      document.getElementById(`option-${index}`).classList.add('correct');
      setScore(score + 1);
      setTimeout(resetGame, 500); // A small delay before resetting
    } else {
      // Wrong answer
      document.getElementById(`option-${index}`).classList.add('wrong');
    }
  };

  return (
    <div>
      <h1>Multiple Choice Game</h1>
      <h2>Word: {selectedWord && selectedWord.word}</h2>
      <h3>Score: {score}</h3>
      <p>Select the correct definition:</p>
      <div className="choices-container">
        {options.map((option, index) => (
          <div key={index} id={`option-${index}`} className="choice" onClick={() => handleOptionClick(option, index)}>
            {option.definition}
          </div>
        ))}
      </div>
    </div>
  );
};






export default GamePage;