// Set the API URL
const apiURL = 'https://complimentsapi-274811442e1d.herokuapp.com/compliment';

// Function to fetch compliment from the API
function fetchCompliment() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.compliment) {
                console.log(data.compliment);
                // Send the compliment to the content script
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    tabs.forEach(tab => {
                        console.log(tab);
                    });
                    if (tabs.length === 0) {
                        console.log('No active tab, skipping');
                        return;
                    }
                    chrome.scripting.executeScript({
                        target: {tabId: tabs[0].id},
                        files: ['inject.js']
                    }).then(() => {
                        chrome.tabs.sendMessage(tabs[0].id, {action: "displayCompliment", compliment: data.compliment});
                    }).catch(error => {
                        if (error.message.includes("chrome:// URL")) {
                            console.log('Skipping display on chrome:// URL');
                        } else {
                            console.error('Failed to inject script into the active tab:', error);
                        }
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching compliment:', error);
        });
}

// Set up an alarm to fetch the compliment every minute
chrome.alarms.create('fetchCompliment', { periodInMinutes: 10 });

// Add a listener for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'fetchCompliment') {
        fetchCompliment();
    }
});

// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    // Set up the initial alarm
    fetchCompliment();
});
