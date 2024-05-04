// background.js
// This script will fetch data from the API every minute and send it to the popup

export function fetchData() {
  const apiURL = 'https://jsonplaceholder.typicode.com/posts/1';

  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      // Check if the body field exists before sending the message
      if (data.hasOwnProperty('body')) {
        const bodyText = data.body;
        // Send the fetched body text to the popup script
        chrome.runtime.sendMessage({ action: "newData", bodyText: bodyText });
      }
    })
    .catch(error => console.error('Error fetching data: ', error));
}

// Fetch data every minute
setInterval(fetchData, 60000);

// Fetch data when the extension is first installed/loaded
fetchData();
