import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

const WordListPage = ({ words }) => {
  return <div>
    Start WordListPage
    <WordList words={words}> </WordList>
    End WordListPage
  </div>;

};

function WordList({ words }) {
  return (
    <div className="word-list">
      <h1>My word list: </h1>
      <div className="word-grid">
        {words && words.map((word, index) => (
          <Word key={index} data={word} />
        ))}
      </div>
    </div>
  );
}

function Word({ data }) {
  return (
    <div className='word-item'>
      <h2>{data.word}</h2>
      <p>Definition: {data.definition}</p>
      <p>Explanation: {data.explanation}</p>
      <p>Example: {data.example}</p>
      <p>Tags: {data.tags}</p>
    </div>
  );
}
export default WordListPage;