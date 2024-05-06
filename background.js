// Set the API URL
const apiURL = 'https://complimentsapi-274811442e1d.herokuapp.com/compliment';

// Function to fetch compliment from the API
function fetchCompliment() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.compliment) {
                // Send the compliment to the content script
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs.length === 0 || !tabs[0].url || tabs[0].url.startsWith('chrome://')) {
                        // Silently ignore chrome:// URLs
                        return;
                    }
                    chrome.scripting.executeScript({
                        target: {tabId: tabs[0].id},
                        files: ['contentScript.js']
                    }).then(() => {
                        // After the script is injected, send the compliment to the content script
                        chrome.tabs.sendMessage(tabs[0].id, {action: "displayCompliment", compliment: data.compliment});
                    }).catch(error => {
                        console.error('Failed to inject script into the active tab:', error);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching compliment:', error);
        });
}

// Set up an alarm to fetch the compliment every minute
chrome.alarms.create('fetchCompliment', { periodInMinutes: 1 });

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
