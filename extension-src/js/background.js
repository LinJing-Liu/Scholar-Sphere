let contextMenuItem = {
    "id": "addWordMenuItem",
    "title": "Add to Scholar Sphere",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClicked.addListener(function (clickData) {
    console.log(clickData);
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) {
            chrome.tabs.sendMessage(tabArray[0].id, { type: "addWord", word: clickData.selectionText });
        }
    );
});