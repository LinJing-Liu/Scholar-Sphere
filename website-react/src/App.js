import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import ReactCardFlip from 'react-card-flip';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          ScholarSphere
        </h1>

      </header>
      <body className="App-body">
        <WordList></WordList>
        <Game></Game>
      </body>
    </div >
  );
}

function WordList() {
  const word_example = {
    word: 'example word',
    definition: 'ex def',
    explanation: 'ex exp',
    example: 'ex ex',
    tag: 'ex tag'
  }

  return (
    <div>
      <h1>My word list: </h1>
      <Word data={word_example} ></Word>

      <InputListener></InputListener>
    </div>
  );
}

function Word({ data }) {
  return (
    <div className='flashcard'>
      <h2>{data.word}</h2>
      <p>Definition: {data.definition}</p>
      <p>Explanation: {data.explanation}</p>
      <p>Example: {data.example}</p>
      <p>Tags: {data.tags}</p>
    </div>
  );
}

//!!!! doesn't work
function FlashCard({ data }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <div onClick={handleClick} className='flashcard'>
        {/* Front of the card */}
        <h2>{data.word}</h2>
      </div>

      <div onClick={handleClick} className='flashcard'>
        {/* Back of the card */}
        <p>Definition: {data.definition}</p>
        <p>Explanation: {data.explanation}</p>
        <p>Example: {data.example}</p>
        <p>Tags: {data.tags}</p>
      </div>
    </ReactCardFlip>
  );
}


const InputListener = () => {
  // Initialize state with the value in localStorage (if it exists) or an empty array
  const [word, setWord] = useState(() => {
    const savedWords = localStorage.getItem("words");
    return savedWords ? JSON.parse(savedWords) : [];
  });

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('new word', (input_word, input_definition, input_explanation, input_example, input_tag) => {
      setWord(prevWords => {
        const newWords = [...prevWords, {
          word: input_word,
          definition: input_definition,
          explanation: input_explanation,
          example: input_example,
          tag: input_tag
          //didn't implement parsing tags yet
        }];

        // Save the new words array to localStorage
        localStorage.setItem("words", JSON.stringify(newWords));

        return newWords;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {word.map((word, index) => (
        <Word key={index} data={word} />
      ))}
    </div>
  );
};


const DICTIONARY = [
  { word: 'apple', definition: 'A round fruit with red or yellow or green skin.' },
  { word: 'banana', definition: 'Long curved fruit which grows in clusters and has soft pulpy flesh and yellow skin when ripe.' },
  { word: 'cat', definition: 'A small domesticated carnivorous mammal with soft fur, a short snout, and retractile claws.' },
  // You can add as many words and definitions as you want.
];

function Game() {
  const [currentWord, setCurrentWord] = useState({});
  const [score, setScore] = useState(0);
  const [inputWord, setInputWord] = useState('');

  // Initialize game with random word
  React.useEffect(() => {
    chooseRandomWord();
  }, []);

  function chooseRandomWord() {
    const randomWord = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)];
    setCurrentWord(randomWord);
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







export default App;
