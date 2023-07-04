const dialogStyle = `
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  color: black;
  background-color: #f5f5f5;
  font-weight: 200 !important;
  height: 500px;
  width: 300px;
  top: 20px;
  left: auto;
  right: 20px;
  float: right;
  margin: 0px;
  border-radius: 20px;
  position: fixed; 
  border: none;
  box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
`
const formStyle = `
  padding: 10px 10px;
  padding-bottom: 25px;
`
const formTitleStyle = `
  font-weight: 200 !important;
  font-size: large;
`
const requiredFieldNoticeStyle = `
  display: none;
`
const formGroupStyle = `
  padding-bottom: 10px!important;
`
const formLabelStyle = "font-size:medium;font-weight:200;"
const formInputStyle = `
  padding: 8px;
  margin: 0;
  font-size: small;
  display: block;
  background-color: white !important;
  color: black !important;
  border-radius: 8px;
  border: 0.5px solid gray;
`
const formTextAreaStyle = `
  padding: 5px 8px;
  margin: 0;
  font-size: small;
  display: block;
  resize: none;
  width: 90%;
  max-height: 50px;
  background-color: white;
  color: black;
  border-radius: 8px;
  border: 0.5px solid gray;
`
const confidenceRangeStyle = `
  margin-bottom: 0;
  padding-bottom: 0px;
`
const tagSectionStyle = `
  list-style-type: none;
  margin: 0px;
  padding: 0px;
`
const tagContainerStyle = `
  background-color: #dbdff9;
  margin-top: 10px;
  margin-bottom: 15px;
  border-radius: 15px;
  padding: 10px;
  padding-bottom: 15px;
`
const addWordButtonStyle = `
  font-size: medium;
  background-color: #4066e0;
  padding: 7px 20px;
  border-radius: 10px;
  margin-top: 5px;
  color: white;
  border: none;
  display: inline;
  margin-left: 20px;
`
const addTagButtonStyle = `
  padding: 0;
  padding: 0px 10px;
  margin-left: 10px;
  display: inline;
  background-color: #4066e0;
  color: white;
  border: none;
  border-radius: 10px;
`
const closeDialogButtonStyle = `
  font-size: medium;
  background-color: #f5f5f5;
  padding: 5px 20px;
  border-radius: 10px;
  margin-top: 5px;
  margin-left: 15px;
  color: #3d3c3a;
  border: 1px solid #3d3c3a;
  display: inline;
`
const addTagGroupStyle = `
  display: flex;
  padding: 0;
  margin: 0;
`
const addTagInputStyle = `
  width: 80%;
  padding: 0;
  margin: 0;
  display: inline;
  padding: 5px 8px;
  font-size: small;
`

const modalHTML = `
<form id="extensionForm">
    <h2 id="formTitle">Add Word</h2>
    <div class="form-group custom-form-group">
      <label for="wordInput" style=${formLabelStyle}>Word*</label>
      <br />
      <input class="form-control custom-form-control" id="wordInput" placeholder="Enter word">
    </div>
    <div class="form-group custom-form-group">
      <label for="definitionInput" style=${formLabelStyle}>Short Definition</label>
      <br />
      <input class="form-control custom-form-control" id="definitionInput" placeholder="Enter definition">
    </div>
    <div class="form-group custom-form-group">
      <label for="explanationInput" style=${formLabelStyle}>Explanation</label>
      <br />
      <textarea class="form-control custom-textarea" id="explanationInput" placeholder="Enter explanation"></textarea>
    </div>
    <div class="form-group custom-form-group">
      <label for="exampleInput" style=${formLabelStyle}>Example</label>
      <br />
      <textarea class="form-control custom-textarea" id="exampleInput" placeholder="Enter example"></textarea>
    </div>
    <div class="form-group custom-form-group">
      <label for="pictureInput" style=${formLabelStyle}>Picture Url</label>
      <br />
      <input class="form-control custom-form-control" id="urlInput" placeholder="Enter url">    
    </div>
    <div class="form-group custom-form-group">
      <label style=${formLabelStyle}>Confidence Level (1-5)</label>
      <br />
      <input type="range" class="form-range" min="1" max="5" step="1" id="confidenceRangeInput">
    </div>
    <div class="form-group custom-form-group">
      <label style=${formLabelStyle}>Custom Tags</label>
      <div id="addTagInputGroup">
        <input class="form-control custom-form-control" id="newTagInput" placeholder="Enter new tag">
        <button class="btn btn-primary" id="addTagButton">Add</button>
      </div>
      <div id="customTagContainer">
        <ul id="customTagAdded"></ul>
      </div>
      <ul id="customTagList"></ul>
    </div>
    <i class="smallLabel" id="requireFieldNotice">All required fields must not be empty.</i>
    <br />
    <button type="submit" class="btn btn-primary" id="addWordButton">Submit</button>
    <button class="btn btn-primary" id="closeDialogButton">Cancel</button>
</form>`;

function addStyle(index) {
  document.getElementById("extensionForm").setAttribute("style", formStyle);
  document.getElementById("formTitle").setAttribute("style", formTitleStyle);
  document.getElementById("requireFieldNotice").setAttribute("style", requiredFieldNoticeStyle);
  document.getElementById("confidenceRangeInput").setAttribute("style", confidenceRangeStyle);
  document.getElementById("customTagAdded").setAttribute("style", tagSectionStyle);
  document.getElementById("customTagList").setAttribute("style", tagSectionStyle);
  document.getElementById("customTagContainer").setAttribute("style", tagContainerStyle);
  document.getElementById("addWordButton").setAttribute("style", addWordButtonStyle);
  document.getElementById("addTagButton").setAttribute("style", addTagButtonStyle);
  document.getElementById("closeDialogButton").setAttribute("style", closeDialogButtonStyle);
  document.getElementById("addTagInputGroup").setAttribute("style", addTagGroupStyle);
  document.getElementById("newTagInput").setAttribute("style", addTagInputStyle);

  const customTag = document.getElementsByClassName("custom-tag");
  for(c of customTag) {
    c.setAttribute("style", index.customTagStyle);
  }

  const badgeListImg = document.getElementsByClassName("badgeListImg");
  for(c of badgeListImg) {
    c.setAttribute("style", index.badgeImageStyle);
  }

  const badgeDiv = document.getElementsByClassName("badgeDiv");
  for(c of badgeDiv) {
    c.setAttribute("style", index.badgeDivStyle);
  }

  const customFormControl = document.getElementsByClassName("custom-form-control");
  for(c of customFormControl) {
    c.setAttribute("style", formInputStyle);
  }

  const customTextarea = document.getElementsByClassName("custom-textarea");
  for(c of customTextarea) {
    c.setAttribute("style", formTextAreaStyle);
  }

  const customFormGroup = document.getElementsByClassName("custom-form-group");
  for(c of customFormGroup) {
    c.setAttribute("style", formGroupStyle);
  }

  const tagListItem = document.getElementsByClassName("tagListItem");
  for(c of tagListItem) {
    c.setAttribute("style", index.tagListStyle);
  }
}

function showAddWordModal(index, word) {
  const modal = document.createElement("dialog");
  modal.innerHTML = modalHTML;
  document.body.appendChild(modal);

  const dialog = document.querySelector("dialog");
  dialog.showModal();
  dialog.setAttribute("style", dialogStyle);

  document.getElementById("wordInput").value = word;
  document.getElementById("addWordButton").addEventListener("click", function() {
    if(index.WORDINPUTELE.value != "") {
      dialog.remove();
    }
  });

  index.onLoad(false);
  addStyle(index);
}

(async () => {
  const source = chrome.runtime.getURL("js/index.js");
  const index = await import(source);

  chrome.runtime.onMessage.addListener((request) => {
      console.log(request);
      if (request.type === "addWord") {
          showAddWordModal(index, request.word);
      }
  });
})();