// TODO: update tags with data from API
const DEFAULTTAGS = ["cs", "math", "english", "science"];

var WORDINPUTELE, DEFINITIONINPUTELE, EXPLANATIONINPUTELE, EXAMPLEINPUTELE, CONFIDENCEARANGE, CUSTOMADDEDLIST, CUSTOMINVLIST;

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
  CUSTOMADDEDLIST = document.getElementById("customTagAdded");
  CUSTOMINVLIST = document.getElementById("customTagList");

  const BADGEIDS = createTagElements(CUSTOMINVLIST);
  for (var id of BADGEIDS) {
    document.getElementById(id).addEventListener("click", function (e) { addCustomTag(e); });
    document.getElementById(id + "Img").addEventListener("click", function (e) { addCustomTag(e); });
  }
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
    imgElement.setAttribute("src", "../img/addIcon.png");
    CUSTOMINVLIST.appendChild(liElement);
  } else {
    imgElement.setAttribute("src", "../img/removeIcon.png");
    CUSTOMADDEDLIST.appendChild(liElement);
  }
}

function createTagElements(ul) {
  var badgeIds = [];

  for (var tag of DEFAULTTAGS) {
    var li = document.createElement("li");
    var badgeId = tag + "CustomTag";
    badgeIds.push(badgeId);

    li.setAttribute("id", badgeId + "List");
    li.innerHTML = `
      <div class="badgeDiv">
        <img class="badgeListImg" id=${badgeId + "Img"} src=${"../img/addIcon.png"}></img>
        <span class="badge badge-pill badge-success custom-tag" id=${badgeId}>
        ${tag}
        </span>
      </div>
    `;
    ul.appendChild(li);
  }

  return badgeIds;
}

function addWord(e) {
  e.preventDefault();

  // TODO: update source after implementing right click to add word
  const source = "manual";
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
    "customTags": customTags
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
  DEFAULTTAGS, WORDINPUTELE, DEFINITIONINPUTELE, EXPLANATIONINPUTELE, EXAMPLEINPUTELE,
  CONFIDENCEARANGE, CUSTOMADDEDLIST, CUSTOMINVLIST,
  onLoad, addCustomTag, createTagElements, addWord
};