import React, { useEffect, useState } from 'react';

import io from 'socket.io-client';

import '../css/FlashCardPage.css';

const FlashCardPage = ({ words }) => {
  return <div id="flash-card-page-container">
    Start FlashCardPage
    <FlashCards words={words}></FlashCards>
    End FlashCardPage
  </div>;
};


function FlashCards({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // This line prevents the default action (scrolling) from occurring
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowDown':
          setCurrentIndex((prevIndex) =>
            prevIndex === words.length - 1 ? prevIndex : prevIndex + 1
          );
          break;
        case 'ArrowUp':
          setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [words]);

  const currentCard = words[currentIndex];

  return (
    <div>
      <h1>Flashcards:</h1>
      <FlashCard data={currentCard} />
      <p>
        {currentIndex + 1} out of {words.length}
      </p>
    </div>
  );
}
const FlashCard = ({ data }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flashcard-flipped' : ''}`} onClick={toggleFlip}>
        <div className="flashcard-side flashcard-front">
          {/* Front of the card */}
          <h2>{data.word}</h2>
        </div>
        <div className="flashcard-side flashcard-back">
          {/* Back of the card */}
          <div className="flashcard-content">
            <ul>
              <li>Definition: {data.definition}</li>
              <li>Explanation: {data.explanation}</li>
              <li>Example: {data.example}</li>
              <li>Tags: {data.tags}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FlashCardPage;