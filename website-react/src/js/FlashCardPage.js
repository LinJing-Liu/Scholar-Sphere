import React, { useEffect, useState } from 'react';
import FilterDropdown from './FilterDropdown';
import io from 'socket.io-client';

import '../css/FlashCardPage.css';

const FlashCardPage = ({ words, tags }) => {
  const [tagSelected, setTagSelected] = useState([]);
  const [confidenceSelected, setConfidenceSelected] = useState([]);

  const filteredWords = words.filter(word =>
    (confidenceSelected.includes(word.confidence) || confidenceSelected.length == 0)
    && (word.tag.filter(t => tagSelected.includes(t)).length > 0 || tagSelected.length == 0)
  );
  return <div id="flash-card-page-container">
    start flashcards
    <br></br>
    <h1 id="flashcardsHeading">Flashcards</h1>
    <div id="filterContainer">
      <div id="filterHeading">Filters</div>
      <div class="row">
        <div class="col">
          <FilterDropdown display="Tags" label="tags" options={tags} selection={tagSelected} onSelect={setTagSelected} />
        </div>
        <div class="col">
          <FilterDropdown display="Confidence Level" label="confidence-level" options={["1", "2", "3", "4", "5"]} selection={confidenceSelected} onSelect={setConfidenceSelected} />
        </div>
      </div>
    </div>
    <FlashCards words={filteredWords}></FlashCards>
    end flashcards
    <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
  </div>;
};


function FlashCards({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isEmpty = (words.length === 0)
  console.log(words, currentIndex, isEmpty)
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
      {isEmpty ? <div> <p>no words match your filters</p></div> : <div><FlashCard data={currentCard} />
        <p>
          {currentIndex + 1} out of {words.length}
        </p> </div>}

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