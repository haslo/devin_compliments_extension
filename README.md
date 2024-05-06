# Devin's Compliments Extension

This Chrome extension fetches compliments from a specified API and displays them in a styled overlay on the active webpage. The overlay is designed to be click-through and does not interrupt the user's workflow.

A random compliment will display every 10 minutes. You can fish for compliments by clicking the extension icon.

## Features
- Fetches compliments from `https://complimentsapi-274811442e1d.herokuapp.com/compliment`
- Displays the compliment in the middle of the Chrome window with specific styling
- The display is click-through, not interrupting the user's workflow, and has fade-in and fade-out animations
- Uses Chrome Manifest V3 standards

## Installation in Developer Mode
1. Download the extension package.
2. Open the Chrome browser and navigate to `chrome://extensions/`.
3. Enable Developer Mode by clicking the toggle switch next to "Developer mode".
4. Click the "Load unpacked" button and select the extension directory.

## License
This project is open-sourced under the MIT License. See the LICENSE file for more information.
