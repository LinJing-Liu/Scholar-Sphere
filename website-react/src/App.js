import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          ScholarSphere
        </p>

      </header>
      <body className="App-body">
        <p>
          This is my body
        </p>
        <WordList></WordList>
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
      <h2>My word list: </h2>

      <Word data={word_example} ></Word>
      <InputListener></InputListener>
    </div>
  );
}

function Word({ data }) {
  return (
    <div>
      <h2>{data.word}</h2>
      <p>Definition: {data.definition}</p>
      <p>Explanation: {data.explanation}</p>
      <p>Example: {data.example}</p>
      <p>Tags: {data.tags}</p>
    </div>
  );
}
const InputListener = () => {
  const [word, setWord] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('new word', (input_word, input_definition, input_explanation, input_example, input_tag) => {
      setWord(prevWords => [...prevWords, {
        word: input_word,
        definition: input_definition,
        explanation: input_explanation,
        example: input_example,
        tag: input_tag
        //didn't implement parsing tags yet
      }]);
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


export default App;
