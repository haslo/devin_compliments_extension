// contentScript.js
// This script will create an overlay on the web page to display compliments

function createOverlay(content) {
    // Create the overlay div and set its styles
    let overlay = document.createElement('div');
    overlay.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(5px); color: black; display: flex; justify-content: center; align-items: center; z-index: 10000;');
    overlay.innerHTML = `<div style="padding: 20px; background: lightgrey; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-size: 40px; max-width: 50%; text-align: center;">${content}</div>`;

    // Append the overlay to the body of the page
    document.body.appendChild(overlay);

    // Set up fade in and fade out animations
    overlay.style.transition = 'opacity 3s';
    overlay.style.opacity = 0;
    setTimeout(() => overlay.style.opacity = 1, 100); // Fade in
    setTimeout(() => overlay.style.opacity = 0, 13000); // Stay for 10s then fade out
    setTimeout(() => document.body.removeChild(overlay), 19000); // Remove after fade out
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "newData" && message.bodyText) {
        // Create an overlay with the message body text
        createOverlay(message.bodyText);
    }
});
