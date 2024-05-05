// popup.js
// This script will update the compliment text in the popup based on messages from the background script

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "newData" && message.bodyText) {
    // Update the compliment text with the new data
    document.getElementById('compliment-text').textContent = message.bodyText;
  }
});

// Event listener for the extension icon click to display the configuration UI
chrome.browserAction.onClicked.addListener(function(tab) {
  // Toggle the display of the configuration UI
  var configUI = document.getElementById('config-ui');
  configUI.style.display = configUI.style.display === 'none' ? 'block' : 'none';
});

// Event listener for the frequency input field to validate the input
document.getElementById('frequency-input').addEventListener('input', function(event) {
  // Ensure the value is an integer within the allowed range
  var value = parseInt(event.target.value, 10);
  if (isNaN(value) || value < 1 || value > 240) {
    event.target.value = '';
  }
});

// Event listener for the submit button to update the frequency
document.getElementById('frequency-submit').addEventListener('click', function() {
  // Retrieve the frequency value from the input field
  var frequencyValue = document.getElementById('frequency-input').value;
  // Update the frequency in config.js and adjust the running interval
  chrome.storage.sync.set({ frequency: frequencyValue }, function() {
    console.log('Frequency value is set to ' + frequencyValue);
    // Send a message to the background script to update the interval
    chrome.runtime.sendMessage({ action: "updateFrequency", frequency: frequencyValue });
  });
});
