import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import io from 'socket.io-client';

import HomePage from './HomePage.js';
import FlashCardPage from './FlashCardPage.js'; // Assume your Home component is in Home.js
import WordListPage from './WordListPage.js';
import GamePage from './GamePage.js';
import StatisticsPage from './StatisticsPage.js';
import TagDisplay from './TagDisplay.js';
import '../css/App.css';

function App() {
  const [words, setWords] = useState(() => {
    const savedWords = localStorage.getItem("words");
    return savedWords ? JSON.parse(savedWords) : [];
  });

  const [tags, setTags] = useState(() => {
    var savedTags = localStorage.getItem("tags");
    savedTags = savedTags ? JSON.parse(savedTags) : [];
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
            <Route exact path="/" element={<HomePage words={words} />} />
            <Route exact path="/word-list" element={<WordListPage words={words} onUpdateWord={handleUpdateWord} onDeleteWord={handleDeleteWord} />} />
            <Route exact path="/games" element={<GamePage words={words} />} />
            <Route exact path="/statistics" element={<StatisticsPage />} />
          </Routes>
        </BrowserRouter>

        {/* <FixedNavButtons /> */}
        {/* <InputListener words={words} setWords={setWords} onUpdateWord={handleUpdateWord} onDeleteWord={handleDeleteWord} 
        tags={tags} setTags={setTags} /> */}
    </div>
  );
}


const InputListener = ({ words, setWords, onUpdateWord, onDeleteWord, tags, setTags }) => {
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
    <div>

      <div id="home-page-container">
        <HomePage />
      </div>
      <div id="tmp-tag-display">
        <TagDisplay tags={tags}/>
      </div>
      <div id="flash-card-page-container">
        <FlashCardPage words={words}></FlashCardPage>
      </div>

      <div id="word-list-page-container">
        <WordListPage words={words} onUpdateWord={onUpdateWord} onDeleteWord={onDeleteWord} />
      </div>
      <div id="game-page-container">
        <GamePage words={words}></GamePage>
      </div>
      <div id="statistics-page-container">
        <StatisticsPage />
      </div>

    </div>
  );
};

// const ToPageButton = ({ id, buttonText }) => {
//   const handleScroll = () => {
//     const container = document.getElementById(id);
//     container.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <button onClick={handleScroll}>{buttonText}</button>
//   );
// };

// const FixedNavButtons = () => {
//   return (
//     <div className="fixed-nav-buttons">
//       <div className="brand">ScholarSphere</div>
//       <div className="buttons">
//         <ToPageButton id="home-page-container" buttonText="Home" />
//         <ToPageButton id="flash-card-page-container" buttonText="Flashcards" />
//         <ToPageButton id="word-list-page-container" buttonText="Word List" />
//         <ToPageButton id="game-page-container" buttonText="Games" />
//         <ToPageButton id="statistics-page-container" buttonText="Statistics" />
//       </div>
//     </div>
//   );
// };

export default App;
