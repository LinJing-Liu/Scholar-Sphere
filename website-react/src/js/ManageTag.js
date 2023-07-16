import { useState } from "react";
import { Collapse } from "bootstrap";

import TagBadge from "./TagBadge";

import removeIcon from "../img/removeIcon.png";

const ManageTag = ({ tags, updateTags }) => {
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    setTagInput(e.target.value);
  }

  const addTag = (e) => {
    updateTags([...tags, tagInput]);
    let collapse = new Collapse(document.getElementById("tagContainer"));
    collapse.hide();
    resetFormState();
    window.location.reload();
  }

  const removeTag = (e) => {
    let tag = e.target.id;
    updateTags(tags.filter(t => t != tag));
  }

  const resetFormState = () => {
    setTagInput("");
    document.getElementById("tagInput").value = "";
    let imgElements = document.querySelectorAll(".badgeImg");
    for(let item of imgElements) {
      item.setAttribute("src", removeIcon);
    }
  }

  const onToggle = (e) => {
    e.preventDefault();
    resetFormState();
  }

  return (
    <div>
      <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#tagContainer" aria-expanded="false" aria-controls="tagContainer" onClick={onToggle}>
        Manage Tags
      </button>

      <div class="collapse" id="tagContainer">
        <div class="form-group">
          <label>Tags</label>
          <input class="form-control" id="tagInput" onChange={handleChange}/>
        </div>
        <button type="button" class="btn primary-btn" onClick={addTag}>Add</button>
        {
          tags.map((t, id) => <TagBadge key={id} tag={t} showAdd={false} handleTagChange={removeTag}/>)
        }
      </div>
    </div>
  );
}

export default ManageTag;