import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom";

import io from 'socket.io-client';
import clg from 'crossword-layout-generator';

import Navbar from './NavigationBar';
import '../css/GamePage.css';

const GamePage = ({ words }) => {
  const testjson = [
    {
      "word": "abcd",
      "clue": "first 4 letters of the alphabet"
    },
    {
      "word": "efgh",
      "clue": "next 4 letters of the alphabet"
    },
    // more word objects...
  ]
  //<CrosswordComponent words={testjson} ></CrosswordComponent>
  return <div>
    <Navbar />
    Start GamesPage
    <TypeWord words={words} />
    <MultipleChoice words={words} />

    <CrosswordSkeleton words={words} ></CrosswordSkeleton>

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




const generateCrosswordLayoutSkeleton = (words) => {
  const randomWords = words.words.slice().sort(() => 0.5 - Math.random());
  const selectedWords = randomWords.slice(0, 10);

  const input_json = selectedWords.map(word => ({ answer: word.word, clue: word.definition }));
  const layout = clg.generateLayout(input_json);
  const table = layout.table;

  return {
    table,
    clues: selectedWords.map(word => word.definition),
  };
};

const CrosswordSkeleton = ({ words }) => {
  const [crosswordTable, setCrosswordTable] = useState([]);
  const [clues, setClues] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [winner, setWinner] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const { table, clues } = generateCrosswordLayoutSkeleton({ words });
    setCrosswordTable(table);
    setClues(clues);
    const initialInput = table.map(row => row.map(cell => ''));
    setUserInput(initialInput);
  }, []);

  const handleInputChange = (rowIndex, colIndex, e) => {
    const newInput = userInput.map((row, i) =>
      i !== rowIndex ? row : row.map((cell, j) =>
        j !== colIndex ? cell : e.target.value.toUpperCase()
      )
    );
    setUserInput(newInput);
    if (newInput.every((row, i) =>
      row.every((cell, j) => cell === crosswordTable[i][j])
    )) {
      setWinner(true);
    }
    moveToNextInput(rowIndex, colIndex);
  };

  const moveToNextInput = (rowIndex, colIndex) => {
    // check if there's a valid next cell in the current row
    if (colIndex + 1 < crosswordTable[rowIndex].length && crosswordTable[rowIndex][colIndex + 1] !== '-') {
      inputRefs.current[rowIndex][colIndex + 1].focus();
    } else {
      // if not, go to the cell directly below
      if (rowIndex + 1 < crosswordTable.length && crosswordTable[rowIndex + 1][colIndex] !== '-') {
        inputRefs.current[rowIndex + 1][colIndex].focus();
      }
    }
  };

  return (
    <div>
      {crosswordTable.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => {
            const cellClass = cell === '-' ? 'cell-black' : 'cell-white';
            return (
              <input
                key={colIndex}
                className={`cell ${cellClass}`}
                readOnly={cell === '-'}
                disabled={cell === '-'}
                value={userInput[rowIndex][colIndex] || ''}
                maxLength={1}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e)}
                ref={(el) => {
                  if (!inputRefs.current[rowIndex]) {
                    inputRefs.current[rowIndex] = [];
                  }
                  inputRefs.current[rowIndex][colIndex] = el;
                }}
              />
            );
          })}
        </div>
      ))}
      {winner && <h2>Winner!</h2>}
      <h3>Clues:</h3>
      <ul>
        {clues.map((clue, index) => <li key={index}>{clue}</li>)}
      </ul>
    </div>
  );
};
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