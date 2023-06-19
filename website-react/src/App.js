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
        <MyComponent></MyComponent>
      </body>
    </div >
  );
}

function WordList() {


  return (
    <div>
      <h2>My word list: </h2>

      <Word word="worddd" definition="deffff" explanation='expppp' example='exxxxxx' tags='tagggs'></Word>

    </div>
  );
}

function Word({ word = "", definition = "", explanation = "", example = "", tags = "" }) {
  return (
    <div>
      <h2>{word}</h2>
      <p>Definition: {definition}</p>
      <p>Explanation: {explanation}</p>
      <p>Example: {example}</p>
      <p>Tags: {tags}</p>
    </div>
  );
}
const MyComponent = () => {
  const [in_word, setWord] = useState('word not set');
  const [in_def, setDef] = useState('');
  const [in_exp, setExp] = useState('');
  const [in_ex, setEx] = useState('');
  const [in_tag, setTag] = useState('[tags not set yet, fix later]');

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('new word', (input_word, input_definition, input_explanation, input_example, input_tag) => {
      // on receiving a message, update states

      setWord(input_word);
      setDef(input_definition);
      setExp(input_explanation);
      setEx(input_example);
      //setTag(input_tag);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>

      <Word word={in_word} definition={in_def} explanation={in_exp} example={in_ex} tags={in_tag}></Word>
    </div>
  );
};


export default App;
