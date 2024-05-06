import fs from 'fs';
import zip from 'cross-zip';

// Configuration for Devin's Compliments Extension
const config = {
  // The API URL from which to fetch data
  apiURL: 'https://complimentsapi-274811442e1d.herokuapp.com/compliment',

  // The key from the API response to display as the compliment text
  textKey: 'compliment',

  // The interval between popups in minutes
  popupInterval: 30 // Set to 30 minutes
};

// Ensure the original manifest.json is copied before it's modified
fs.copyFileSync('manifest.json', 'build/manifest.json');

// Read the manifest file from the build directory
let manifest = fs.readFileSync('build/manifest.json', 'utf8');

// Replace the placeholder with the actual API URL from config
manifest = manifest.replace('{{apiURL}}', config.apiURL);

// Write the updated manifest back to build/manifest.json
fs.writeFileSync('build/manifest.json', manifest);

// Copy the images directory to the build directory
fs.mkdirSync('build/images', { recursive: true }); // Ensure the target directory exists
fs.copyFileSync('images/icon16.png', 'build/images/icon16.png');
fs.copyFileSync('images/icon48.png', 'build/images/icon48.png');
fs.copyFileSync('images/icon128.png', 'build/images/icon128.png');

// Copy other necessary files to the build directory
fs.copyFileSync('popup.html', 'build/popup.html');
fs.copyFileSync('popup.js', 'build/popup.js');
fs.copyFileSync('popup.css', 'build/popup.css');
fs.copyFileSync('background.js', 'build/background.js');
// Removed the copying of config.js as it's now integrated within build.js

// Create a zip file of the build directory
zip.zipSync('build', 'build/devin_compliments_extension.zip');
