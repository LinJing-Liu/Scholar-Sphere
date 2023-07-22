import React, { useState } from 'react';
import DOMPurify from "dompurify";

import Navbar from './NavigationBar';
import FilterDropdown from './FilterDropdown';
import AddWordForm from './AddWordForm';
import '../css/WordListPage.css';

import searchIcon from '../img/search.png';
import editIcon from '../img/edit.png';
import deleteIcon from '../img/delete.png';
import starIcon from '../img/star.png';
import filledStarIcon from '../img/star_fill.png';
import AddWordCollapse from './AddWordCollapse';
import ManageTag from './ManageTag';

const confidenceColor = [
  {
    background: "#ffd0ca", 
    badge: "rgb(255, 114, 114)"
  },
  {
    background: "#ffddc7", 
    badge: "orange"
  },
  {
    background: "#fff6d0c9", 
    badge: "hsl(57, 100%, 54%)"
  },
  {
    background: "#edffd7", 
    badge: "rgb(177, 251, 74)"
  },
  {
    background: "#d3ffda", 
    badge: "rgb(37, 206, 37)"
  }
]

const WordListPage = ({ words, onUpdateWord, onDeleteWord, onAddWord, tags, updateTags }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagSelected, setTagSelected] = useState([]);
  const [confidenceSelected, setConfidenceSelected] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredWords = words.filter(word =>
    (
      (word.word && word.word.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (word.definition && word.definition.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (word.explanation && word.explanation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (word.example && word.example.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (word.tags && word.tags.toLowerCase().includes(searchTerm.toLowerCase()))
    ) && (confidenceSelected.includes(word.confidence) || confidenceSelected.length == 0)
    && (word.tag.filter(t => tagSelected.includes(t)).length > 0 || tagSelected.length == 0)
  );

  return (
    <div>
      <Navbar />
      <div id="word-list-page-container">
        <div id="word-list-page-header">
          <h1 id="wordlistHeading">Word List</h1>
          <div class="input-group mb-3" id="searchInputDiv">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default">
                <img src={searchIcon} />
                Search
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Enter keywords"
              value={searchTerm}
              onChange={handleSearch}
              aria-describedby="inputGroup-sizing-default"
            />
          </div>

          <div id="filterContainer">
            <div id="filterHeading">Filters</div>
            <div class="row">
              <div class="col">
                <FilterDropdown display="Tags" label="tags" options={tags} selection={tagSelected} onSelect={setTagSelected}/>
              </div>
              <div class="col">
                <FilterDropdown display="Confidence Level" label="confidence-level" options={["1", "2", "3", "4", "5"]} selection={confidenceSelected} onSelect={setConfidenceSelected}/>
              </div>
            </div>
          </div>

          <br />
          <div id="controlContainer">
            <div class="row">
              <div class="col">
                <AddWordCollapse tags={tags} onAddWord={onAddWord} />
              </div>
              <div class="col">
                <ManageTag tags={tags} updateTags={updateTags}/>
              </div>
            </div>
          </div>
        </div>

        <div id="word-list-page-content">
          <WordList words={filteredWords} searchTerm={searchTerm} onUpdateWord={onUpdateWord} onDeleteWord={onDeleteWord} tags={tags} />
        </div>
      </div>
    </div>
  );
};
function WordList({ words, searchTerm, onUpdateWord, onDeleteWord, tags }) {
  return (
    <div className="word-list">
      <div className="word-grid">
        {words && words.map((word, index) => (
          <Word key={index} data={word} searchTerm={searchTerm} onUpdateWord={(updatedWord) => onUpdateWord(updatedWord, index)} onDeleteWord={() => onDeleteWord(index)} tags={tags} />
        ))}
      </div>
    </div>
  );
}



function Word({ data, searchTerm, onUpdateWord, onDeleteWord, tags }) {
  const regex = new RegExp(`(${searchTerm})`, 'gi');

  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState(data);

  const highlightText = (text) => {
    return text.replace(
      regex,
      match => `<span class='highlight'>${match}</span>`
    );
  };

  const handleDelete = () => {
    // Call the function passed from the parent component
    onDeleteWord();
  };

  const handleEdit = () => {
    setTempData(data);
    setEditing(true);
  };

  const handleSave = () => {
    // Here, you can make an API call to save the changes,
    // and then, set editing to false.
    onUpdateWord(tempData); // Call the function passed from the parent component
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setTempData(data);
    setEditing(false);
  };

  const toggleStar = () => {
    let updateWord = data;
    if(updateWord.tag.indexOf("starred") != -1) {
      updateWord.tag = updateWord.tag.filter(tag => tag != "starred");
    } else {
      updateWord.tag.push("starred");
    }
    onUpdateWord(updateWord);
  }

  if(editing) {
    return (<AddWordForm tags={tags} customClass="edit-form" formColor={confidenceColor[data.confidence - 1].background} word={tempData} setWord={setTempData} handleSave={handleSave} handleCancel={handleCancelEdit} />);  
  }

  const word = highlightText(data.word);
  const definition = highlightText(data.definition);
  const explanation = highlightText(data.explanation);
  const example = highlightText(data.example);

  return (
    <div className="word-item" style={{ backgroundColor: confidenceColor[data.confidence - 1].background }}>
      <div className="row">
        <div class="col-9 word-confidence">
          <span class="badge" style={{ backgroundColor: confidenceColor[data.confidence - 1].badge }}>CONFIDENCE {data.confidence && data.confidence}</span>
        </div>
        <div class="col-3">
          {
            data.tag.indexOf("starred") != -1 ?
            <img src={filledStarIcon} onClick={() => toggleStar()}/> :
            <img src={starIcon} onClick={() => toggleStar()}/>
          }
        </div>
      </div>
      <h2 class="word-heading" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(word) }}></h2>
      <p class="word-definition"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(definition) }}></span></p>
      <p class="word-explanation"><label>Explanation</label> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(explanation) }}></span></p>
      <p class="word-example"><label>Example</label> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(example) }}></span></p>

      <p class="word-tags">
        {data.tag && data.tag.filter(t => t != "starred").map((t, id) => <span class="badge tag-badge" key={id}>{t}</span>)}
      </p>

      <p class="word-picture-container">
        {data.picture && <img class="word-picture" src={data.picture} />}
      </p>

      <button type="button" class="btn primary-btn word-button edit-button" onClick={handleEdit}>
        <img src={editIcon} /> Edit 
      </button>
      <button type="button" class="btn primary-btn word-button delete-button" onClick={handleDelete}>
        <img src={deleteIcon} /> Delete
      </button>
    </div>
  );
}

export default WordListPage;