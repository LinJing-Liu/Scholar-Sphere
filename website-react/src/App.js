import React, { useEffect } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import './App.css';


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
  // useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:8765');

  //   socket.onopen = () => {
  //     console.log('WebSocket connection established');
  //   };

  //   socket.onmessage = (event) => {
  //     const message = event.data;
  //     const wordData = JSON.parse(message);
  //     console.log('wordData: ', wordData)
  //   };
  //   socket.onclose = (event) => {
  //     console.log('WebSocket connection closed:', event.code, event.reason);
  //   };

  //   socket.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   return () => {
  //     socket.close(); // Close the WebSocket connection on component unmount
  //   };
  // }, []);
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


export default App;
