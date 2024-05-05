# Devin's Compliments Extension

This Chrome extension fetches data from a specified API and displays the content in a styled overlay within the Chrome browser window.

## How It's Built

The extension is built with HTML, CSS, and JavaScript. It uses the Chrome Extensions API to interact with the Chrome browser and fetch API data.

## Configuration

The extension uses a `config.js` file to store configurable parameters such as the API URL, the key for the text to display, and the interval between popups.

## Development

To continue development:

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Make changes to the codebase as needed.
5. Use `npm test` to run tests and ensure functionality.

## Running Unit Tests

To run the unit tests:

1. Ensure all dependencies are installed by running `npm install`.
2. Run `npm test` to execute the tests.
3. The test results will be displayed in the terminal. All tests should pass (indicated by green text).

## Testing in Chrome

To test the extension in Chrome:

1. Open the Chrome browser.
2. Navigate to `chrome://extensions/`.
3. Enable 'Developer mode' at the top right.
4. Click 'Load unpacked' and select the extension directory.
5. The extension should now be installed and can be tested.

## Files

- `manifest.json`: Extension manifest file.
- `popup.html`: HTML for the popup.
- `popup.css`: Styles for the popup.
- `popup.js`: JavaScript for the popup.
- `background.js`: Background script for fetching data.
- `config.js`: Configuration file.
- `test/`: Directory containing test files.

## Contributing

To contribute to this project:

1. Create a feature branch from `develop`.
2. Make and commit your changes.
3. Push your branch and create a pull request to `develop`.

For more information, refer to the contributing guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
