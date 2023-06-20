const modalStyle = `
    height: 500px;
    width: 300px;
    top: 20px;
    left: auto;
    right: 20px;
    float: right;
    margin: 0px;
    border-radius: 20px;
    background-color: white;
    position: fixed; 
    border: none;
    box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
`;

const modalHTML = `
<form id="extensionForm">
    <h2 id="formTitle">Add Word</h2>
    <div class="form-group">
      <label for="wordInput">Word</label>
      <input class="form-control" id="wordInput" placeholder="Enter word">
    </div>
    <div class="form-group">
      <label for="definitionInput">Short Definition</label>
      <input class="form-control" id="definitionInput" placeholder="Enter definition">
    </div>
    <div class="form-group">
      <label for="explanationInput">Explanation</label>
      <textarea class="form-control" id="explanationInput" placeholder="Enter explanation"></textarea>
    </div>
    <div class="form-group">
      <label for="exampleInput">Example</label>
      <textarea class="form-control" id="exampleInput" placeholder="Enter example"></textarea>
    </div>
    <div class="form-group">
      <label for="pictureInput">Picture</label>
    </div>
    <div class="form-group">
      <label>Confidence Level</label>
      <input type="range" class="form-range" min="1" max="5" step="1" id="confidenceRangeInput">
      <label id="lowerRange">1</label>
      <label id="upperRange">5</label>
    </div>
    <div class="form-group">
      <label>Custom Tags</label>
      <ul id="customTagAdded"></ul>
      <hr />
      <div class="form-check">
        <ul id="customTagList"></ul>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" id="addWordButton">Submit</button>
</form>`;

function showAddWordModal(index) {
    const modal = document.createElement("dialog");
    modal.setAttribute("style", modalStyle);
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);

    const dialog = document.querySelector("dialog");
    
    dialog.showModal();
    document.getElementById("addWordButton").addEventListener("click", function() {
        dialog.close();
    });

    index.onLoad();
}

(async () => {
    const source = chrome.runtime.getURL("js/index.js");
    const index = await import(source);

    chrome.runtime.onMessage.addListener((request) => {
        console.log(request);
        if (request.type === "addWord") {
            showAddWordModal(index);
        }
    });
})();