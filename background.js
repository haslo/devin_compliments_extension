// background.js
// This script will fetch data from the API every minute and send it to the popup

// Define config object directly in background.js for now
const config = {
  apiURL: 'https://complimentsapi-274811442e1d.herokuapp.com/compliment',
  textKey: 'compliment',
  popupInterval: 30 // Set to 30 minutes
};

function fetchData() {
  console.log("Fetching data..."); // Log when data fetch is initiated
  fetch(config.apiURL)
    .then(response => response.json())
    .then(data => {
      // Check if the configured text key field exists before sending the message
      if (data.hasOwnProperty(config.textKey)) {
        const bodyText = data[config.textKey];
        // Send the fetched body text to the popup script
        chrome.runtime.sendMessage({ action: "newData", bodyText: bodyText }, function(response) {
          if (chrome.runtime.lastError) {
            // Log error if there is no listener registered
            console.error('Error sending message: ', JSON.stringify(chrome.runtime.lastError, null, 2));
          } else {
            // Log the response if it exists
            console.log("Response from receiver: ", response);
          }
        });
        console.log("Data fetched and sent: ", bodyText); // Log the fetched data
      }
    })
    .catch(error => console.error('Error fetching data: ', error));
}

function init() {
  // Create an alarm to fetch data at the interval specified in the config
  chrome.alarms.create("fetchDataAlarm", { periodInMinutes: config.popupInterval });

  // Fetch data immediately when the script is loaded
  fetchData();
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "updateFrequency" && message.frequency) {
    const frequency = parseInt(message.frequency, 10);
    if (!isNaN(frequency) && frequency >= 1 && frequency <= 240) {
      // Update the frequency in config
      config.popupInterval = frequency;
      // Create or update the alarm with the new frequency
      chrome.alarms.create("fetchDataAlarm", { periodInMinutes: frequency });
      // Persist the updated frequency value
      chrome.storage.sync.set({ popupInterval: frequency }, function() {
        console.log('Popup frequency updated to ' + frequency + ' minutes.');
      });
    }
  }
});

// Set up an alarm listener to call fetchData when the alarm goes off
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "fetchDataAlarm") {
    fetchData();
  }
});

// Call init to create the alarm and immediate data fetch
init();
