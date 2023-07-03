// TODO: update tags with data from API
const TAGS = ["cs", "math", "english", "science"];

const ADDICON = chrome.runtime.getURL("img/addIcon.png");
const REMOVEICON = chrome.runtime.getURL("img/removeIcon.png");

var WORDINPUTELE, DEFINITIONINPUTELE, EXPLANATIONINPUTELE, EXAMPLEINPUTELE, CONFIDENCEARANGE, PICTUREINPUTELE;
var CUSTOMADDEDLIST, CUSTOMINVLIST, REQUIREFIELDNOTICE, NEWTAGINPUT;

document.addEventListener("DOMContentLoaded", function () {
  onLoad();
});

function onLoad() {
  // initialize add word form elements
  WORDINPUTELE = document.getElementById("wordInput");
  DEFINITIONINPUTELE = document.getElementById("definitionInput");
  EXPLANATIONINPUTELE = document.getElementById("explanationInput");
  EXAMPLEINPUTELE = document.getElementById("exampleInput");
  CONFIDENCEARANGE = document.getElementById("confidenceRangeInput");
  PICTUREINPUTELE = document.getElementById("urlInput");
  CUSTOMADDEDLIST = document.getElementById("customTagAdded");
  CUSTOMINVLIST = document.getElementById("customTagList");
  REQUIREFIELDNOTICE = document.getElementById("requireFieldNotice");
  NEWTAGINPUT = document.getElementById("newTagInput");

  const BADGEIDS = createTagElements(CUSTOMINVLIST);
  for (var id of BADGEIDS) {
    document.getElementById(id).addEventListener("click", function (e) { addCustomTag(e); });
    document.getElementById(id + "Img").addEventListener("click", function (e) { addCustomTag(e); });
  }
  
  document.getElementById("addTagButton").addEventListener("click", addTag);
  document.getElementById("addWordButton").addEventListener("click", addWord);
}

function addCustomTag(e) {
  e.preventDefault();
  const id = e.target.id;
  const idx = id.indexOf("Img");
  var badgeId = id;
  if (idx != -1) {
    badgeId = id.substring(0, idx);
  }

  const ulId = e.target.parentElement.parentElement.parentElement.id;
  const liElement = document.getElementById(badgeId + "List");
  const imgElement = document.getElementById(badgeId + "Img");

  if (ulId == "customTagAdded") {
    imgElement.setAttribute("src", ADDICON);
    CUSTOMINVLIST.appendChild(liElement);
  } else {
    imgElement.setAttribute("src", REMOVEICON);
    CUSTOMADDEDLIST.appendChild(liElement);
  }
}

function createTagElements(ul) {
  var badgeIds = [];

  for (var tag of TAGS) {
    var li = document.createElement("li");
    var badgeId = tag + "CustomTag";
    badgeIds.push(badgeId);

    li.setAttribute("id", badgeId + "List");
    li.setAttribute("class", "tagListItem");
    li.innerHTML = `
      <div class="badgeDiv">
        <img class="badgeListImg" id=${badgeId + "Img"} src=${ADDICON}></img>
        <span class="badge badge-pill badge-success custom-tag" id=${badgeId}>
        ${tag}
        </span>
      </div>
    `;
    ul.appendChild(li);
  }

  return badgeIds;
}

function addTag(e) {
  e.preventDefault();

  let newTag = NEWTAGINPUT.value;
  if(newTag == "" || TAGS.indexOf(newTag) >= 0) { 
    NEWTAGINPUT.value = "";
    return; 
  }

  var li = document.createElement("li");
  var badgeId = newTag + "CustomTag";

  li.setAttribute("id", badgeId + "List");
  li.innerHTML = `
    <div class="badgeDiv">
      <img class="badgeListImg" id=${badgeId + "Img"} src=${REMOVEICON}></img>
      <span class="badge badge-pill badge-success custom-tag" id=${badgeId}>
      ${newTag}
      </span>
    </div>
  `;

  CUSTOMADDEDLIST.appendChild(li);
  // TODO: post the updated tag to API
  TAGS.push(newTag);

  NEWTAGINPUT.value = "";
  document.getElementById(badgeId).addEventListener("click", function (e) { addCustomTag(e); });
  document.getElementById(badgeId + "Img").addEventListener("click", function (e) { addCustomTag(e); });

}

function resetFormFields() {
  WORDINPUTELE.value = "";
  DEFINITIONINPUTELE.value = "";
  EXPLANATIONINPUTELE.value = "";
  EXAMPLEINPUTELE.value = "";
  CONFIDENCEARANGE.value = 3;
  PICTUREINPUTELE.value = "";

  while(CUSTOMADDEDLIST.childNodes.length > 0) {
    var c = CUSTOMADDEDLIST.childNodes[0];
    var id = c.id;
    var imgElement = document.getElementById(id.substring(0, id.indexOf("List")) + "Img");
    imgElement.setAttribute("src", ADDICON);
    CUSTOMINVLIST.appendChild(c);
  }

  REQUIREFIELDNOTICE.setAttribute("style", "display: none");
}

function addWord(e) {
  e.preventDefault();

  // TODO: update source after implementing right click to add word
  const source = "manual";
  if(WORDINPUTELE.value == "") {
    REQUIREFIELDNOTICE.setAttribute("style", "display: inline");
    return;
  }
  const confidenceLevel = CONFIDENCEARANGE.value;
  var customTags = [];

  const children = CUSTOMADDEDLIST.children;
  for (var c of children) {
    customTags.push(c.id.substring(0, c.id.indexOf("CustomTag")));
  }

  const response = {
    "word": WORDINPUTELE.value,
    "definition": DEFINITIONINPUTELE.value,
    "explanation": EXPLANATIONINPUTELE.value,
    "example": EXAMPLEINPUTELE.value,
    "source": source,
    "confidenceLevel": confidenceLevel,
    "picture": PICTUREINPUTELE.value,
    "customTags": customTags
  }

  resetFormFields();
  console.log('about to send to API');
  console.log(JSON.stringify(response))

  fetch('http://localhost:5000/api/addterm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      console.log('Response:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export {
  TAGS, WORDINPUTELE, DEFINITIONINPUTELE, EXPLANATIONINPUTELE, EXAMPLEINPUTELE, PICTUREINPUTELE,
  CONFIDENCEARANGE, CUSTOMADDEDLIST, CUSTOMINVLIST, REQUIREFIELDNOTICE,
  onLoad, addCustomTag, createTagElements, addWord
};