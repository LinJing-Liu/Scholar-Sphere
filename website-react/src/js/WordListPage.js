import React, { useEffect, useState } from 'react';

import io from 'socket.io-client';
import DOMPurify from "dompurify";

import Navbar from './NavigationBar';
import FilterDropdown from './FilterDropdown';
import '../css/WordListPage.css';
import searchIcon from '../img/search.png';

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
      <div className="word-list-page-container">
        word list page start
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
              <FilterDropdown label="Tags" options={tags} selection={tagSelected} onSelect={setTagSelected} />
            </div>
            <div class="col">
              <FilterDropdown label="Confidence Level" options={["1", "2", "3", "4", "5"]} selection={confidenceSelected} onSelect={setConfidenceSelected} />
            </div>
          </div>
        </div>

        <WordList words={filteredWords} searchTerm={searchTerm} onUpdateWord={onUpdateWord} onDeleteWord={onDeleteWord} />
        word list page end
      </div>
    </div>
  );
};
function WordList({ words, searchTerm, onUpdateWord, onDeleteWord }) {
  return (
    <div className="word-list">
      <div className="word-grid">
        {words && words.map((word, index) => (
          <Word key={index} data={word} searchTerm={searchTerm} onUpdateWord={(updatedWord) => onUpdateWord(updatedWord, index)} onDeleteWord={() => onDeleteWord(index)} />
        ))}
      </div>
    </div>
  );
}



function Word({ data, searchTerm, onUpdateWord, onDeleteWord }) {
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
    setEditing(true);
  };

  const handleSave = () => {
    // Here, you can make an API call to save the changes,
    // and then, set editing to false.
    onUpdateWord(tempData); // Call the function passed from the parent component
    setEditing(false);
  };
  if (editing) {
    return (
      <div className='word-item'>
        Word:
        <input name="word" value={tempData.word} onChange={handleChange} />
        <br></br>
        Definition:
        <textarea name="definition" value={tempData.definition} onChange={handleChange} />
        <br></br>
        Explanation:
        <textarea name="explanation" value={tempData.explanation} onChange={handleChange} />
        <br></br>
        Example:
        <textarea name="example" value={tempData.example} onChange={handleChange} />
        <br></br>
        Picture:
        <textarea name="picture" value={tempData.picture} onChange={handleChange} />
        <br></br>
        {/* TODO: update tag to allow user add and delete tag dynamically */}
        Tags:
        <input name="tags" value={tempData.tags} onChange={handleChange} />
        <br></br>
        <button onClick={handleSave}>Save</button>

      </div>
    );
  }
  const word = highlightText(data.word);
  const definition = highlightText(data.definition);
  const explanation = highlightText(data.explanation);
  const example = highlightText(data.example);
  // const tags = data.tags && highlightText(data.tags);

  return (
    <div className="word-item">
      <div class="word-confidence">
        <span class="badge">Confidence ({data.confidence && data.confidence})</span>
      </div>

      <h2 class="word-heading" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(word) }}></h2>
      <p class="word-definition"><strong>Definition:</strong> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(definition) }}></span></p>
      <p class="word-explanation"><strong>Explanation:</strong> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(explanation) }}></span></p>
      <p class="word-example"><strong>Example:</strong> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(example) }}></span></p>
      {/* {tags && <p><strong>Tags:</strong> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tags) }}></span></p>} */}
      {data.tag && data.tag.map((t, id) => <span class="badge" key={id}>{t}</span>)}
      {data.picture && <img class="word-picture" src={data.picture} />}

      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default WordListPage;