import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom";

import io from 'socket.io-client';
import clg from 'crossword-layout-generator';

import Navbar from './NavigationBar';
import '../css/GamePage.css';
import rewardIcon from '../img/reward.png';

const GamePage = ({ words }) => {
  return <div>
    <Navbar />
    <div className="game-page-container" id="game-page-container">
      <div id="game-page-header">
        <h1 id="gamePageHeading">Games</h1>
        <h2 id="gamePageSubheading">Play. Learn. Have Fun.</h2>
      </div>

      <TypeWord words={words} />
      <MultipleChoice words={words} />
      <CrosswordSkeleton words={words} ></CrosswordSkeleton>
    </div>

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
    <div class="typeWordContainer">
      <h1 class="gameTileHeading">Type the Word</h1>
      <br />
      <div class="scoreTile">
        <span class="badge">Score: {score}</span>
        <img src={rewardIcon}/>
      </div>
      <div class="questionTile">
        <span>Definition: </span>
        {currentWord.definition}
      </div>

      <form onSubmit={handleSubmit}>
        <div class="form-group typeWordForm">
          <input
            type="text"
            class="form-control"
            value={inputWord}
            onChange={handleInputChange}
            placeholder="Type the word here"
            required
          />
          <button type="submit" class="btn btn-primary typeWordSubmitBtn">Submit</button>
        </div>
      </form>
    </div>
  );
}
const generateCrosswordLayoutSkeleton = (words) => {
  const randomWords = words.words.slice().sort(() => 0.5 - Math.random());
  const selectedWords = randomWords.slice(0, 10);

  const input_json = selectedWords.map(word => ({ answer: word.word, clue: word.definition }));
  const layout = clg.generateLayout(input_json);
  let table = layout.table;

  // Add a buffer of "-" around the table
  const bufferRow = Array(table[0].length + 2).fill('-');
  table = table.map(row => ['-'].concat(row).concat(['-']));
  table.unshift(bufferRow);
  table.push(bufferRow);

  // Creating an array for word indexes
  const wordIndexes = layout.result.reduce((arr, word) => {
    if (word.orientation !== "none") {
      // Increment row and column index by 1 to account for the added buffer
      arr[word.position - 1] = { row: word.starty + 1, col: word.startx + 1, number: word.position };
    }
    return arr;
  }, []);

  return {
    table,
    clues: layout.result.map((word, index) => {
      if (word.orientation !== "none") {
        return `${word.position}. ${selectedWords[index].definition}`;
      }
      return null;
    }).filter(Boolean),
    wordIndexes,
  };
};

const CrosswordSkeleton = ({ words }) => {
  const [crosswordTable, setCrosswordTable] = useState([]);
  const [clues, setClues] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [winner, setWinner] = useState(false);
  const [wordIndexes, setWordIndexes] = useState([]);
  const inputRefs = useRef([]);
  const [previousSquare, setPreviousSquare] = useState({ row: null, col: null });

  useEffect(() => {
    const { table, clues, wordIndexes } = generateCrosswordLayoutSkeleton({ words });
    setCrosswordTable(table);
    setClues(clues);
    setWordIndexes(wordIndexes);
    const initialInput = table.map(row => row.map(cell => ''));
    setUserInput(initialInput);
  }, []);
  const handleKeyDown = (rowIndex, colIndex, e) => {
    if (e.key === 'ArrowUp' && rowIndex - 1 >= 0 && crosswordTable[rowIndex - 1][colIndex] !== '-') {
      inputRefs.current[rowIndex - 1][colIndex].focus();
    } else if (e.key === 'ArrowDown' && rowIndex + 1 < crosswordTable.length && crosswordTable[rowIndex + 1][colIndex] !== '-') {
      inputRefs.current[rowIndex + 1][colIndex].focus();
    } else if (e.key === 'ArrowLeft' && colIndex - 1 >= 0 && crosswordTable[rowIndex][colIndex - 1] !== '-') {
      inputRefs.current[rowIndex][colIndex - 1].focus();
    } else if (e.key === 'ArrowRight' && colIndex + 1 < crosswordTable[rowIndex].length && crosswordTable[rowIndex][colIndex + 1] !== '-') {
      inputRefs.current[rowIndex][colIndex + 1].focus();
    }
  };
  const handleInputChange = (rowIndex, colIndex, e) => {
    const inputValue = e.target.value;
    const newInput = userInput.map((row, i) =>
      i !== rowIndex ? row : row.map((cell, j) =>
        j !== colIndex ? cell : inputValue ? inputValue[inputValue.length - 1].toUpperCase() : ''
      )
    );
    setUserInput(newInput);
    if (
      newInput.every((row, i) =>
        row.every(
          (cell, j) =>
            cell.toLowerCase() === crosswordTable[i][j].toLowerCase() ||
            crosswordTable[i][j] === "-"
        )
      )
    ) {
      setWinner(true);
    }
    if (inputValue) {
      // Only move to next input if a character was added
      moveToNextInput(rowIndex, colIndex);
    }
    setPreviousSquare({ row: rowIndex, col: colIndex });
  };

  const moveToNextInput = (rowIndex, colIndex) => {
    if (previousSquare.row === rowIndex - 1 && previousSquare.col === colIndex) {
      // If the previous cell was directly above, move down
      if (rowIndex + 1 < crosswordTable.length && crosswordTable[rowIndex + 1][colIndex] !== '-') {
        inputRefs.current[rowIndex + 1][colIndex].focus();
      }
    } else {
      // Otherwise, continue as before
      if (colIndex + 1 < crosswordTable[rowIndex].length && crosswordTable[rowIndex][colIndex + 1] !== '-') {
        inputRefs.current[rowIndex][colIndex + 1].focus();
      } else if (rowIndex + 1 < crosswordTable.length && crosswordTable[rowIndex + 1][colIndex] !== '-') {
        inputRefs.current[rowIndex + 1][colIndex].focus();
      }
    }
  };

  return (
    <div className="crossword-game-container">
      <h1 class="crosswordHeading">Crossword Game</h1>
      <div class="row">
        
        <div className="col crossword-table">
          {crosswordTable.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => {
                const cellClass = cell === '-' ? 'cell-black' : 'cell-white';
                const wordIndex = wordIndexes.find(idx => idx.row === rowIndex && idx.col === colIndex)
                  ? wordIndexes.find(idx => idx.row === rowIndex && idx.col === colIndex).number
                  : null;

                return (
                  <div className={`cell ${cellClass}`} key={colIndex}>
                    {wordIndex && <div className="cell-number">{wordIndex}</div>}
                    {cell !== '-' && (
                      <input
                        className="cell-input"
                        value={userInput[rowIndex][colIndex] || ''}
                        maxLength={2}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e)}
                        onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                        ref={(el) => {
                          if (!inputRefs.current[rowIndex]) {
                            inputRefs.current[rowIndex] = [];
                          }
                          inputRefs.current[rowIndex][colIndex] = el;
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div class="col crosswordClueContainer">
          <h3 class="clueHeading">Clues</h3>
          <ul class="clueList">
            {clues.map((clue, index) => <li key={index}>{clue}</li>)}
          </ul>
        </div>
      </div>
      {winner && <h2 class="crosswordWinner">Winner!</h2>}
    </div >
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
    <div class="multipleChoiceContainer">
      <h1 class="mcTileHeading">Multiple Choice Game</h1>
      <div class="scoreTile">
        Score: {score}
        <img src={rewardIcon} />
      </div>
      <div class="mcQuestionTile">
        Word: {selectedWord && selectedWord.word}
        <div>Select the correct definition:</div>
      </div>
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