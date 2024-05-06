// This function will be injected into the tab and executed there
function createOverlay(compliment) {
    // Create the overlay div
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.fontSize = '40px';
    overlay.style.color = 'black';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Light grey, semi-transparent
    overlay.style.padding = '20px';
    overlay.style.borderRadius = '10px';
    overlay.style.textAlign = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.pointerEvents = 'none'; // Make the overlay click-through
    overlay.style.backdropFilter = 'blur(10px)'; // Frosted glass effect
    overlay.textContent = compliment;

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Set the fade in and fade out animations
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 3s';
    setTimeout(() => {
        overlay.style.opacity = '1';
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 6000); // Wait for fade out before removing
        }, 10000); // Display time
    }, 300); // Delay before fade in
}

// This function will be called by the background script with the compliment text
function receiveCompliment(complimentText) {
    createOverlay(complimentText);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "displayCompliment") {
            receiveCompliment(request.compliment);
        }
    }
);
