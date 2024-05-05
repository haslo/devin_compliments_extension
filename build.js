import fs from 'fs';
import config from './config.js';

// Read the manifest file
let manifest = fs.readFileSync('manifest.json', 'utf8');

// Insert the placeholder for the API URL
manifest = manifest.replace('https://jsonplaceholder.typicode.com/', '{{apiURL}}');

// Replace the placeholder with the actual API URL from config.js
manifest = manifest.replace('{{apiURL}}', config.apiURL);

// Write the updated manifest back to manifest.json
fs.writeFileSync('manifest.json', manifest);
