// background.js
// This script will fetch data from the API every minute and send it to the popup
import config from './config.js';

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

// Initialize the extension's background script functionality
export function init() {
  // Fetch data at the interval specified in the config
  setInterval(fetchData, config.popupInterval * 60000);

  // Fetch data immediately when the script is loaded
  fetchData();
}

// Call init to start the interval and immediate data fetch
init();
