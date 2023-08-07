import React, { useEffect, useState } from 'react';
import FilterDropdown from './FilterDropdown';

import '../css/FlashCardPage.css';
import helpIcon from '../img/help.png';

const allConfidence = ["1", "2", "3", "4", "5"];
const contentDisplay = ["Word", "Definition", "Explanation", "Example"];

const FlashCardPage = ({ words, tags }) => {
  const [tagSelected, setTagSelected] = useState(tags);
  const [confidenceSelected, setConfidenceSelected] = useState(allConfidence);

  const filteredWords = words.filter(word =>
    confidenceSelected.includes(word.confidence)
    && (word.tag.filter(t => tagSelected.includes(t)).length > 0
    || (tagSelected.length == tags.length && word.tag.length == 0))
  );

  const [frontSelected, setFrontSelected] = useState(["Word"]);
  const [backSelected, setBackSelected] = useState(["Definition"]);

  return <div id="flash-card-page-container">
    <br></br>
    <h1 id="flashcardsHeading">
      Flashcards
      <img src={helpIcon} data-toggle="modal" data-target="#helpModalCenter" id="cardHelpBtn"/>
    </h1>
    <FlashcardHelpModal />

    <div id="displayFilterContainer">
      <div id="displayFilterHeading">Display Filters</div>
      <div class="row">
        <div class="col">
          <FilterDropdown display="Front Display" label="frontDisplay" options={contentDisplay} selection={frontSelected} onSelect={setFrontSelected} displaySelection={false} />
        </div>
        <div class="col">
          <FilterDropdown display="Back Display" label="backDisplay" options={contentDisplay} selection={backSelected} onSelect={setBackSelected} displaySelection={false} />
        </div>
      </div>
    </div>
    <br />
    <div id="filterContainer">
      <div id="cardFilterHeading">Filters</div>
      <div class="row">
        <div class="col">
          <FilterDropdown display="Tags" label="cardTags" options={tags} selection={tagSelected} onSelect={setTagSelected}/>
        </div>
        <div class="col">
          <FilterDropdown display="Confidence Level" label="cardConfidenceLevel" options={allConfidence} selection={confidenceSelected} onSelect={setConfidenceSelected} />
        </div>
      </div>
    </div>
    <FlashCards words={filteredWords} front={frontSelected} back={backSelected} />
  </div>;
};

function FlashCards({ words, front, back }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isEmpty = (words.length === 0);

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
      {!isEmpty ? 
        <div>
          <FlashCard data={currentCard} front={front} back={back} />
          <p className="cardCountLabel">
            {currentIndex + 1} out of {words.length}
          </p>
        </div>
      : <div id="addWordNotice">
          There is no word in the inventory or the filters have filtered out all words.
          <br />
          <a onClick={() => window.location.href="/word-list"}>Go to word list page to add word.</a>
        </div>
      }
    </div>
  );
}

const FlashCard = ({ data, front, back }) => {
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

  function getDisplay(displayArr) {
    // current content type - Word, Definition, Explanation, Example
    var display = [];
    for(var displayType of displayArr) {
      if(displayType == "Word") {
        display.push(data.word);
      } else if(displayType == "Definition") {
        display.push("Definition: " + data.definition);
      } else if (displayType == "Explanation") {
        display.push("Explanation: " + data.explanation);
      } else if(displayType == "Example") {
        display.push("Example: " + data.example);
      }
    }

    return display;
  }

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flashcard-flipped' : ''}`} onClick={toggleFlip}>
        <div className="flashcard-side flashcard-front">
          {/* Front of the card */}
          <div className="flashcard-content">
            {getDisplay(front).map((str, id) => <div className="flashcard-display-item" key={id}>{str}</div>)}
          </div>
        </div>
        <div className="flashcard-side flashcard-back">
          {/* Back of the card */}
          <div className="flashcard-content">
            {getDisplay(back).map((str, id) => <div className="flashcard-display-item" key={id}>{str}<br /></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardHelpModal = () => {
  return (
    <div class="modal fade" id="helpModalCenter" tabindex="-1" role="dialog" aria-labelledby="FlashcardInstructions" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cardHelpModalTitle">Flashcard Instructions</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ul class="flashcardModalList">
              <li>Press up or down arrow to switch between cards in order.</li>
              <li>Press left or right arrow to flip the card.</li>
              <li>Can also click on the card to flip it.</li>
              <li>Use the display filters to customize what is displayed on the front and back sides of the card.</li>
              <li>Use the regular filters to customize which groups of cards to view.</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modalCloseBtn" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashCardPage;