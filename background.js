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
                    if (tabs.length === 0) {
                        console.error('No active tab found.');
                        return;
                    }
                    chrome.scripting.executeScript({
                        target: {tabId: tabs[0].id},
                        func: (compliment) => {
                            if (typeof createOverlay === 'function') {
                                createOverlay(compliment);
                            }
                        },
                        args: [data.compliment]
                    }, (injectionResults) => {
                        if (chrome.runtime.lastError || injectionResults.length === 0) {
                            console.error('Failed to inject script into the active tab.');
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
