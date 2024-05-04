// popup.js
// This script will update the compliment text in the popup based on messages from the background script

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "newData") {
    // Update the compliment text with the new data
    document.getElementById('compliment-text').textContent = message.bodyText;
  }
});
