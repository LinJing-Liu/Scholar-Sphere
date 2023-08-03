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

console.log('Background script has been injected');

chrome.runtime.onInstalled.addListener(() => {
    console.log('Creating initial alarm...');
    chrome.alarms.create("myAlarm", { delayInMinutes: 1, periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm fired!', alarm);

    if (alarm.name === "myAlarm") {
        let title = "Notification";
        let message = "This is a notification";
        let opt = {
            type: "basic",
            title: title,
            message: message,
            iconUrl: "/img/puppy.png" // Replace this with your actual icon URL
        }

        console.log('Showing notification...');
        chrome.notifications.create('notify1', opt, function (id) { console.log("Last error:", chrome.runtime.lastError); });

        // Automatically close notification after 5 seconds
        setTimeout(() => {
            console.log('Closing notification...');
            chrome.notifications.clear('notify1', function (wasCleared) { console.log(wasCleared); });
        }, 5000);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message);

    let minutes = parseFloat(message.minutes);
    if (isNaN(minutes)) {
        console.error('Invalid minutes:', message.minutes);
        return;
    }

    // Create or recreate the alarm with the given interval
    console.log('Creating alarm with interval:', minutes);
    chrome.alarms.create("myAlarm", { delayInMinutes: minutes, periodInMinutes: minutes });
});
