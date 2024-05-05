import fs from 'fs';
import config from './config.js';

// Read the manifest file
let manifest = fs.readFileSync('manifest.json', 'utf8');

// Replace the placeholder with the actual API URL from config.js
manifest = manifest.replace('{{apiURL}}', config.apiURL);

// Write the updated manifest back to manifest.json
fs.writeFileSync('manifest.json', manifest);

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
fs.copyFileSync('config.js', 'build/config.js');
fs.copyFileSync('manifest.json', 'build/manifest.json');

// Create a zip file of the build directory
const zip = require('cross-zip');
zip.zipSync('build', 'build/devin_compliments_extension.zip');
