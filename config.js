// Configuration for Devin's Compliments Extension

const config = {
  // The API URL from which to fetch data
  apiURL: 'https://jsonplaceholder.typicode.com/posts/1',

  // The key from the API response to display as the compliment text
  textKey: 'body',

  // The interval between popups in minutes
  popupInterval: 1 // Default to 1 minute
};

export default config;
