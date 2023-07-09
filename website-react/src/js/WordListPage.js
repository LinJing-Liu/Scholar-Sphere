import React, { useEffect, useState } from 'react';

import io from 'socket.io-client';
import DOMPurify from "dompurify";

import Navbar from './NavigationBar';
import '../css/WordListPage.css';

const WordListPage = ({ words, onUpdateWord, onDeleteWord }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredWords = words.filter(word =>
    (word.word && word.word.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (word.definition && word.definition.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (word.explanation && word.explanation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (word.example && word.example.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (word.tags && word.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <Navbar />
      Start WordListPage
      <h1>My word list: </h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <WordList words={filteredWords} searchTerm={searchTerm} onUpdateWord={onUpdateWord} onDeleteWord={onDeleteWord} />

      End WordListPage
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
  const tags = data.tags && highlightText(data.tags);

  return (
    <div className='word-item'>
      <h2 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(word) }}></h2>
      <p><strong>Definition:</strong> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(definition) }}></span></p>
      <p><strong>Explanation:</strong> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(explanation) }}></span></p>
      <p><strong>Example:</strong> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(example) }}></span></p>
      {tags && <p><strong>Tags:</strong> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tags) }}></span></p>}
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default WordListPage;