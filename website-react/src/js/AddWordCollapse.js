import { useState } from 'react';
import { Collapse } from 'bootstrap';

import AddWordForm from './AddWordForm';
import addIcon from '../img/addIcon.png';

const emptyWord = {
  word: "",
  definition: "",
  explanation: "",
  example: "",
  source: "website",
  confidence: 3,
  picture: "",
  tag: []
}

const AddWordCollapse = ({ tags, onAddWord, words }) => {
  const [tempWord, setTempWord] = useState(emptyWord);

  const handleSubmit = (e) =>  {
    e.preventDefault();
    const sameWord = words.filter(w => w.toString().toLowerCase() == tempWord.toString().toLowerCase());
    if(sameWord.length > 0) {
      alert("This word is already in the list!");
      return;
    }
    onAddWord(tempWord);
    resetFormState(true);
  }

  const resetFormState = (hideCollapse) => {
    if(hideCollapse) {
      let collapse = new Collapse(document.getElementById("addWordContainer"));
      collapse.hide();
    }
    setTempWord(emptyWord);
    document.querySelector("#addWordForm").reset();
    let imgElements = document.querySelectorAll(".badgeImg");
    for(let item of imgElements) {
      item.setAttribute("src", addIcon);
    }
  }

  const onToggle = (e) => {
    e.preventDefault();
    let hidingCollapse = document.getElementById("addWordCollpaseBtn").ariaExpanded;
    if(hidingCollapse) {
      resetFormState(false);
    }
  }

  const cancelForm = (e) => {
    e.preventDefault();
    resetFormState(true);
  }

  return (
    <div>
      <button class="btn btn-primary toggle-btn" id="addWordCollpaseBtn" type="button" data-toggle="collapse" data-target="#addWordContainer" aria-expanded="false" aria-controls="addWordContainer" onClick={onToggle}>
        Add Word
      </button>

      <div class="collapse" id="addWordContainer">
        <form id="addWordForm">
            <AddWordForm customClass="addWordForm" tags={tags} formColor={"white"} word={tempWord} setWord={setTempWord} handleSave={handleSubmit} handleCancel={cancelForm}/>
        </form>
      </div>
    </div>
  );
}

export default AddWordCollapse;