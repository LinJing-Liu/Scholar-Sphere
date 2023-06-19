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
        <InputListener></InputListener>
      </body>
    </div >
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
      <WordList words={word}> </WordList>
      <Game words={word}></Game>
    </div>
  );
};



function WordList({ words }) {

  return (
    <div>
      <h1>My word list: </h1>

      {words.map((word, index) => (
        <Word key={index} data={word} />
      ))}
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







export default App;
