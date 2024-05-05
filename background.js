// background.js
// This script will fetch data from the API every minute and send it to the popup
import config from './config.js';

let fetchInterval;

export function fetchData() {
  fetch(config.apiURL)
    .then(response => response.json())
    .then(data => {
      // Check if the configured text key field exists before sending the message
      if (data.hasOwnProperty(config.textKey)) {
        const bodyText = data[config.textKey];
        // Send the fetched body text to the popup script
        chrome.runtime.sendMessage({ action: "newData", bodyText: bodyText });
      }
    })
    .catch(error => console.error('Error fetching data: ', error));
}

export function setFetchInterval(minutes) {
  // Clear any existing interval
  clearInterval(fetchInterval);

  // Set a new interval with the provided frequency value
  fetchInterval = setInterval(fetchData, minutes * 60000);
}

export function init() {
  // Fetch data at the interval specified in the config
  setFetchInterval(config.popupInterval);

  // Fetch data immediately when the script is loaded
  fetchData();
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "updateFrequency" && message.frequency) {
    const frequency = parseInt(message.frequency, 10);
    if (!isNaN(frequency) && frequency >= 1 && frequency <= 240) {
      // Update the frequency in config and adjust the running interval
      config.popupInterval = frequency;
      setFetchInterval(frequency);
      // Persist the updated frequency value
      chrome.storage.sync.set({ popupInterval: frequency }, function() {
        console.log('Popup frequency updated to ' + frequency + ' minutes.');
      });
    }
  }
});

// Call init to start the interval and immediate data fetch
init();
