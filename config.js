// Configuration for Devin's Compliments Extension

const config = {
  // The API URL from which to fetch data
  apiURL: 'https://complimentsapi-274811442e1d.herokuapp.com/compliment',

  // The key from the API response to display as the compliment text
  textKey: 'compliment',

  // The interval between popups in minutes
  popupInterval: 1 // Default to 1 minute
};

export default config;
