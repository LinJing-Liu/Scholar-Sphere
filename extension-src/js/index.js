const ADDICON = chrome.runtime.getURL("img/addIcon.png");
const REMOVEICON = chrome.runtime.getURL("img/removeIcon.png");

const customTagStyle = `
  background-color: #5819f7 !important;
  padding: 6px;
  color: white;
  border-radius: 5px 7px;
`
const badgeImageStyle = `
  max-width: 20px !important;
`
const badgeDivStyle = `
  display: inline-block;
  margin: 0px;
  padding: 0px;
  padding-top: 8px;
`
const tagListStyle = `
  display: inline;
  margin: 0px;
  padding: 0px;
  padding-right: 15px;
`

var WORDINPUTELE, DEFINITIONINPUTELE, EXPLANATIONINPUTELE, EXAMPLEINPUTELE, CONFIDENCEARANGE, PICTUREINPUTELE;
var CUSTOMADDEDLIST, CUSTOMINVLIST, REQUIREFIELDNOTICE, NEWTAGINPUT;

var fromPopup = false;
var tags = [];

document.addEventListener("DOMContentLoaded", function () {
  onLoad(true);
});


// document.getElementById('intervalForm').addEventListener('submit', function (event) {
//   event.preventDefault();
//   let minutes = parseFloat(document.getElementById('minutes').value);
//   if (isNaN(minutes)) {
//     console.error('Invalid minutes:', document.getElementById('minutes').value);
//     return;
//   }

//   console.log('Sending message:', minutes);
//   chrome.runtime.sendMessage({ minutes: minutes });
// });


function onLoad(b) {
  fromPopup = b;

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

  document.getElementById("addTagButton").addEventListener("click", addTag);
  document.getElementById("addWordButton").addEventListener("click", addWord);

  getTags();
}

function getTags() {
  fetch("http://localhost:5000/api/tag", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      console.log("Response:", data);
      tags = data.tag;
      createTagElements(CUSTOMINVLIST);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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

  for (var tag of tags) {
    badgeIds.push(createSingleTag(tag, ul, ADDICON));
  }

}

function createSingleTag(tag, parentElement, icon) {
  var badgeId = tag + "CustomTag";
  var li = document.createElement("li");
  li.setAttribute("id", badgeId + "List");
  li.setAttribute("class", "tagListItem");
  li.setAttribute("style", tagListStyle);

  var div = document.createElement("div");
  div.setAttribute("class", "badgeDiv");

  var img = document.createElement("img");
  img.setAttribute("class", "badgeListImg");
  img.setAttribute("id", badgeId + "Img");
  img.setAttribute("src", icon);
  img.addEventListener("click", function (e) { addCustomTag(e); });

  var span = document.createElement("span");
  span.setAttribute("class", "badge badge-pill badge-success custom-tag");
  span.setAttribute("id", badgeId);
  span.addEventListener("click", function (e) { addCustomTag(e); });
  span.innerHTML = tag;

  li.appendChild(div);
  div.appendChild(img);
  div.appendChild(span);
  parentElement.appendChild(li);

  if (!fromPopup) {
    console.log("not from popup");
    li.setAttribute("style", tagListStyle);
    div.setAttribute("style", badgeDivStyle);
    img.setAttribute("style", badgeImageStyle);
    span.setAttribute("style", customTagStyle);
  }

  return badgeId;
}

function addTag(e) {
  e.preventDefault();

  let newTag = NEWTAGINPUT.value;
  if (newTag == "" || tags.indexOf(newTag) >= 0) {
    NEWTAGINPUT.value = "";
    return;
  }

  createSingleTag(newTag, CUSTOMADDEDLIST, REMOVEICON);
  tags.push(newTag);
  NEWTAGINPUT.value = "";

  fetch("http://localhost:5000/api/tag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tag: newTag }),
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      console.log("Response:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

}

function resetFormFields() {
  WORDINPUTELE.value = "";
  DEFINITIONINPUTELE.value = "";
  EXPLANATIONINPUTELE.value = "";
  EXAMPLEINPUTELE.value = "";
  CONFIDENCEARANGE.value = 3;
  PICTUREINPUTELE.value = "";

  while (CUSTOMADDEDLIST.childNodes.length > 0) {
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

  const source = fromPopup ? "manual" : "automatic";
  if (WORDINPUTELE.value == "") {
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

  if (fromPopup) {
    resetFormFields();
  }
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
  tags, WORDINPUTELE, DEFINITIONINPUTELE, EXPLANATIONINPUTELE, EXAMPLEINPUTELE, PICTUREINPUTELE,
  CONFIDENCEARANGE, CUSTOMADDEDLIST, CUSTOMINVLIST, REQUIREFIELDNOTICE,
  customTagStyle, badgeImageStyle, badgeDivStyle, tagListStyle,
  onLoad, addCustomTag, createTagElements, addWord
};