function createOverlay(compliment) {
    // Create the overlay div
    let overlay = document.createElement('div');
    overlay.setAttribute('style', `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        max-width: 600px;
        background-color: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(2px);
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-size: 40px;
        color: black;
        text-align: center;
    `);

    // Create the text div
    let textDiv = document.createElement('div');
    textDiv.textContent = compliment;

    // Append text to overlay
    overlay.appendChild(textDiv);

    // Append overlay to body
    document.body.appendChild(overlay);

    // Make the overlay click-through
    overlay.style.pointerEvents = 'none';

    // Fade in the overlay
    overlay.style.opacity = 0;
    let fadeInInterval = setInterval(() => {
        if (overlay.style.opacity < 1) {
            overlay.style.opacity = parseFloat(overlay.style.opacity) + 0.1;
        } else {
            clearInterval(fadeInInterval);
        }
    }, 300);

    // Set timeout to fade out and remove the overlay after 10 seconds
    setTimeout(() => {
        let fadeOutInterval = setInterval(() => {
            if (overlay.style.opacity > 0) {
                overlay.style.opacity = parseFloat(overlay.style.opacity) - 0.1;
            } else {
                clearInterval(fadeOutInterval);
                document.body.removeChild(overlay);
            }
        }, 600);
    }, 13000); // 3s fade in + 10s display
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "showOverlay" && message.compliment) {
        createOverlay(message.compliment);
    }
});
