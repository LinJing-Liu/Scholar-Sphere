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