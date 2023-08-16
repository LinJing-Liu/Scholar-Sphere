import React, { useState, useEffect } from 'react';
import DOMPurify from "dompurify";

import Navbar from './NavigationBar';
import FilterDropdown from './FilterDropdown';
import AddWordForm from './AddWordForm';
import SortDropdown from './SortDropdown';

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

const allConfidence = ["1", "2", "3", "4", "5"];

const WordListPage = ({ words, setWords, onUpdateWord, onDeleteWord, onAddWord, tags, updateTags }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagSelected, setTagSelected] = useState(tags);
  const [confidenceSelected, setConfidenceSelected] = useState(allConfidence);
  const [simpleView, setSimpleView] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredWords = words.filter(word =>
    (
      word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.explanation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.example?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.tags?.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (confidenceSelected.includes(word.confidence))
    && ((word.tag.length == 0 && tagSelected.length == tags.length)
      || word.tag.filter(t => tagSelected.includes(t)).length > 0)
  );

  return (
    <div>
      <Navbar />
      <div class="word-list-page-container" id="word-list-page-container">
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
          
          <div id="viewContainer">
            <button className="btn primary-btn viewToggleButton" onClick={() => setSimpleView(!simpleView)}>
              Show {simpleView ? 'Detailed' : 'Simple'} View
            </button>
            <SortDropdown label={"Sort Words"} words={words} setWords={setWords} />
          </div>

          <div id="filterContainer">
            <div id="filterHeading">Filters</div>
            <div class="row">
              <div class="col">
                <FilterDropdown display="Tags" label="tags" options={tags} selection={tagSelected} onSelect={setTagSelected} />
              </div>
              <div class="col">
                <FilterDropdown display="Confidence Level" label="confidence-level" options={allConfidence} selection={confidenceSelected} onSelect={setConfidenceSelected} />
              </div>
            </div>
          </div>

          <br />
          <div id="controlContainer">
            <div class="row">
              <div class="col">
                <AddWordCollapse tags={tags} onAddWord={onAddWord} words={words} />
              </div>
              <div class="col">
                <ManageTag tags={tags} updateTags={updateTags} />
              </div>

            </div>
          </div>
        </div>

        <div id="word-list-page-content">
          <WordList words={filteredWords} searchTerm={searchTerm} onUpdateWord={onUpdateWord} onDeleteWord={onDeleteWord} tags={tags} simpleView={simpleView} />
        </div>
      </div>
    </div>
  );
};
function WordList({ words, searchTerm, onUpdateWord, onDeleteWord, tags, simpleView }) {
  if (simpleView) {
    return (
      <table class="table">
        <thead>
          <tr>
            <th>Word</th>
            <th>Definition</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word, index) => (
            <tr key={index}>
              <td>{word.word}</td>
              <td>{word.definition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="word-list">
      <div className="word-grid">
        {words.map((word, index) => (
          <Word
            key={index}
            data={word}
            searchTerm={searchTerm}
            onUpdateWord={(updatedWord) => onUpdateWord(updatedWord, index)}
            onDeleteWord={() => onDeleteWord(index)}
            tags={tags}
          />
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
    const res = window.confirm("Are you sure you want to delete this word?");
    if (res) onDeleteWord();
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
    if (updateWord.tag.indexOf("starred") != -1) {
      updateWord.tag = updateWord.tag.filter(tag => tag != "starred");
    } else {
      updateWord.tag.push("starred");
    }
    onUpdateWord(updateWord);
  }

  if (editing) {
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
              <img src={filledStarIcon} onClick={() => toggleStar()} /> :
              <img src={starIcon} onClick={() => toggleStar()} />
          }
        </div>
      </div>
      <h2 class="word-heading" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(word) }}></h2>
      <p class="word-definition"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(definition) }}></span></p>
      <p class="word-explanation"><label>Explanation</label> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(explanation) }}></span></p>
      <p class="word-example"><label>Example</label> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(example) }}></span></p>

      <p class="word-tags">
        {data.tag?.filter(t => t != "starred").map((t, id) => <span class="badge tag-badge" key={id}>{t}</span>)}
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