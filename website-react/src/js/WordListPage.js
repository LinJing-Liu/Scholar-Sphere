import React, { useEffect, useState } from 'react';

import io from 'socket.io-client';
import DOMPurify from "dompurify";

import Navbar from './NavigationBar';
import FilterDropdown from './FilterDropdown';
import '../css/WordListPage.css';

import searchIcon from '../img/search.png';
import addIcon from '../img/addIcon.png';
import removeIcon from '../img/removeIcon.png';
import editIcon from '../img/edit.png';
import deleteIcon from '../img/delete.png';
import starIcon from '../img/star.png';
import filledStarIcon from '../img/star_fill.png';

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

const WordListPage = ({ words, onUpdateWord, onDeleteWord, tags }) => {
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

  const handleChange = (event) => {
    setTempData({ ...tempData, [event.target.name]: event.target.value });
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
  const handleTagChange = (event) => {
    let newTempData = tempData;
    let tag = event.target.id;
    if(tempData.tag.indexOf(tag) != -1) {
      newTempData.tag = newTempData.tag.filter(t => t != tag);
    } else {
      newTempData.tag.push(tag);
    }
    if(event.target.src == addIcon) {
      event.target.setAttribute("src", removeIcon);
    } else {
      event.target.setAttribute("src", addIcon);
    }
    setTempData(newTempData);
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
    return (
      <div className="word-item edit-form" style={{ backgroundColor: confidenceColor[data.confidence - 1].background }}>
        <div class="form-group">
          <label>Word</label>
          <input class="form-control" name="word" value={tempData.word} onChange={handleChange} />
        </div>
        <div class="form-group">
          <label>Definition</label>
          <textarea class="form-control" name="definition" value={tempData.definition} onChange={handleChange} />
        </div>
        <div class="form-group">
          <label>Explanation</label>
          <textarea class="form-control" name="explanation" value={tempData.explanation} onChange={handleChange} />
        </div>
        <div class="form-group">
          <label>Example</label>
          <textarea class="form-control" name="example" value={tempData.example} onChange={handleChange} />
        </div>
        <div class="form-group">
          <label>Picture</label>
          <textarea class="form-control" name="picture" value={tempData.picture} onChange={handleChange} />
        </div>
        <div class="form-group">
          <label>Confidence Level</label>
          <select class="form-control" id="confidence-select" name="confidence" value={tempData.confidence} onChange={handleChange}>
            {[1, 2, 3, 4, 5].map((n, id) => <option key={id}>{n}</option>)}
          </select>
        </div>
        <div class="form-group">
          <label>Tags</label>
          <div class="add-tag-section">
            {
              tempData.tag && 
              tempData.tag.filter(t => t != "starred").map((t, id) => <span key={id}><img id={t} src={removeIcon} onClick={(e) => handleTagChange(e)} /><span class="badge tag-badge edit-tag-badge">{t}</span></span>)
            }
          </div>
          <div class="remove-tag-section">
            {
              tags &&
              tags.filter(t => tempData.tag.indexOf(t) == -1 && t != "starred").map((t, id) => 
                <span key={id}>
                  <img id={t} src={addIcon} onClick={(e) => handleTagChange(e)} />
                  <span class="badge tag-badge edit-tag-badge">{t}</span>
                </span>)
            }
          </div>
        </div>
        <button type="button" class="btn primary-btn word-button save-button" onClick={handleSave}>Save</button>
        <button type="button" class="btn primary-btn word-button cancel-button" onClick={handleCancelEdit}>Cancel</button>
      </div>
    );
  }

  const word = highlightText(data.word);
  const definition = highlightText(data.definition);
  const explanation = highlightText(data.explanation);
  const example = highlightText(data.example);
  // const tags = data.tags && highlightText(data.tags);

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