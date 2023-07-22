import { useState } from "react";
import { Collapse } from "bootstrap";

import cancelIcon from "../img/cancel.png";

const ManageTag = ({ tags, updateTags }) => {
  const [tagInputCount, setTagInputCount] = useState(0);

  const addTag = () => {
    let inputDiv = document.createElement("div");
    inputDiv.setAttribute("class", "input-group");
    inputDiv.setAttribute("id", "add-tag-input-" + tagInputCount);
    let inputElement = document.createElement("input");
    inputElement.setAttribute("class", "form-control add-tag-input");

    let appendDiv = document.createElement("div");
    appendDiv.setAttribute("class", "input-group-append");
    let img = document.createElement("img");
    img.setAttribute("src", cancelIcon);
    img.addEventListener("click", function() {
      document.querySelector("#add-tag-input-" + tagInputCount).remove()
    });
    appendDiv.appendChild(img);

    inputDiv.appendChild(inputElement);
    inputDiv.appendChild(appendDiv);

    setTagInputCount(tagInputCount + 1);
    document.querySelector("#addTagContainer").appendChild(inputDiv);
  }

  const resetFormState = () => {
    setTagInputCount(0);
    document.querySelector("#addTagContainer").innerHTML = "";
    let checkBoxElements = document.querySelectorAll(".remove-tag-input");
    for(let c of checkBoxElements) {
      c.checked = false;
    }
  }

  const submitTag = () => {
    let newTagInput = document.querySelectorAll(".add-tag-input");
    let newTag = [];
    for(let c of newTagInput) {
      if(c.value != "" && tags.indexOf(c.value) == -1) {
        newTag.push(c.value);
      }
    }

    let removeTagInput = document.querySelectorAll(".remove-tag-input");
    let removeTag = [];
    for(let c of removeTagInput) {
      if(c.checked) {
        removeTag.push(c.value);
      }
    }

    let updatedTag = tags.filter(t => removeTag.indexOf(t) == -1);
    updatedTag = updatedTag.concat(newTag);
    updateTags(updatedTag);

    let collapse = new Collapse(document.getElementById("tagContainer"));
    collapse.hide();
    resetFormState();
  }

  const onToggle = (e) => {
    e.preventDefault();
    resetFormState();
  }

  return (
    <div>
      <button class="btn btn-primary toggle-btn" id="tagCollapseBtn" type="button" data-toggle="collapse" data-target="#tagContainer" aria-expanded="false" aria-controls="tagContainer" onClick={onToggle}>
        Manage Tags
      </button>

      <div class="collapse" id="tagContainer">
        <button type="button" class="btn primary-btn" onClick={addTag}>Add Tag</button>
        <div id="addTagContainer"></div>
        <label id="tagLabel">Tags</label>
        <div id="tagList">
          {
            tags.map((t, id) => 
            <div class="form-check">
              <input class="form-check-input remove-tag-input" type="checkbox" value={t} />
              <label class="form-check-label">{t}</label>
            </div>)
          }
        </div>
        <button type="button" class="btn primary-btn" onClick={submitTag}>Save Changes</button>
      </div>
    </div>
  );
}

export default ManageTag;