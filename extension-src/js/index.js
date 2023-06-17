var WORDINPUTELE, DEFINITIONINPUTELE, EXPLANATIONINPUTELE, EXAMPLEINPUTELE, TAGINPUTELE;


document.addEventListener("DOMContentLoaded", function () {
  WORDINPUTELE = document.getElementById("wordInput");
  DEFINITIONINPUTELE = document.getElementById("definitionInput");
  EXPLANATIONINPUTELE = document.getElementById("explanationInput");
  EXAMPLEINPUTELE = document.getElementById("exampleInput");
  TAGINPUTELE = document.getElementById("tagInput");

  document.getElementById("addWordButton").addEventListener("click", addWord);
});

function addWord(e) {
  e.preventDefault();

  const response = {
    "word": WORDINPUTELE.value,
    "definition": DEFINITIONINPUTELE.value,
    "explanation": EXPLANATIONINPUTELE.value,
    "example": EXAMPLEINPUTELE.value,
    "tag": TAGINPUTELE.value
  }

  console.log(response);
}

