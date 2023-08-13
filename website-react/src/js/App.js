import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import HomePage from './HomePage.js';
import WordListPage from './WordListPage.js';
import GamePage from './GamePage.js';
import '../css/App.css';

function App() {
  const [words, setWords] = useState(() => {
    const savedWords = localStorage.getItem("words");
    return savedWords ? JSON.parse(savedWords) : [];
  });

  const [tags, setTags] = useState(() => {
    var savedTags = localStorage.getItem("tags");
    savedTags = savedTags ? JSON.parse(savedTags) : [];
    if (savedTags.indexOf("starred") == -1) {
      savedTags.push("starred");
      localStorage.setItem("tags", JSON.stringify(savedTags));
    }
    const socket = io('http://localhost:5000');
    socket.emit("sync tag", { savedTags });

    return savedTags;
  });

  const handleUpdateWord = (updatedWord, index) => {
    const newWords = [...words];
    newWords[index] = updatedWord;
    setWords(newWords);
    localStorage.setItem("words", JSON.stringify(newWords));
  };

  const handleDeleteWord = (index) => {
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
    localStorage.setItem("words", JSON.stringify(newWords));
  };

  const handleAddWord = (word) => {
    let newWords = [...words, word];
    setWords(newWords);
    localStorage.setItem("words", JSON.stringify(newWords));
    console.log(newWords)
  }

  const handleUpdateAllWords = (updatedWords) => {
    setWords(updatedWords);
    localStorage.setItem("words", JSON.stringify(updatedWords));
  }

  const handleUpdateTag = (savedTags) => {
    const socket = io('http://localhost:5000');
    socket.emit("sync tag", { savedTags });
    setTags(savedTags);
    localStorage.setItem("tags", JSON.stringify(savedTags));

    let newWords = words;
    for (let w of newWords) {
      w.tag = w.tag.filter(t => savedTags.indexOf(t) != -1);
    }
    handleUpdateAllWords(newWords);
  }

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('new word', (input_word, input_definition, input_explanation, input_example, input_source, input_confidence_level, input_picture, input_tag) => {
      setWords(prevWords => {
        const newWords = [...prevWords, {
          word: input_word,
          definition: input_definition,
          explanation: input_explanation,
          example: input_example,
          source: input_source,
          confidence: input_confidence_level,
          picture: input_picture,
          tag: input_tag
        }];

        // Save the new words array to localStorage
        localStorage.setItem("words", JSON.stringify(newWords));

        return newWords;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [setWords]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("new tag", (tag) => {
      setTags(prevTags => {
        const newTags = [...prevTags, tag];
        localStorage.setItem("tags", JSON.stringify(newTags));
        return newTags;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [setTags]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage words={words} tags={tags} />} />
          <Route exact path="/word-list" element={<WordListPage words={words} onUpdateWord={handleUpdateWord} onDeleteWord={handleDeleteWord} onAddWord={handleAddWord} tags={tags} updateTags={handleUpdateTag} />} />
          <Route exact path="/game-page" element={<GamePage words={words} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
