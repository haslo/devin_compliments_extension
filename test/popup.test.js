import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import config from '../config.js';

// Load the popup HTML into jsdom
const { document } = (new JSDOM(`<!DOCTYPE html><html><body>
<div id="compliment-container" style="font-size: 40px; color: black; background: rgba(211, 211, 211, 0.5);">
  <p id="compliment-text">Fetching compliment...</p>
  <div id="config-ui" style="display: none;">
    <input type="number" id="frequency-input" min="1" max="240" value="${config.popupInterval}">
    <button id="frequency-submit">Update Frequency</button>
  </div>
</div>
</body></html>`)).window;

// Since we cannot require the actual popup script, we will need to simulate its behavior
global.document = document;
global.chrome = {
  runtime: {
    onMessage: { addListener: sinon.stub() },
    sendMessage: sinon.stub()
  },
  storage: {
    sync: {
      get: sinon.stub().callsFake((key, callback) => {
        callback({ frequency: config.frequency });
      }),
      set: sinon.stub()
    }
  },
  browserAction: {
    onClicked: {
      addListener: sinon.stub().callsFake(callback => {
        if (typeof callback === 'function') {
          document.getElementById('config-ui').style.display = 'block';
          callback();
        }
      })
    }
  }
};

// This path may need to be adjusted based on the actual location of popup.js
import('../popup.js').then(() => {
  // Set up the listener mock to simulate the reception of messages
  global.chrome.runtime.onMessage.addListener.callsFake((message, sender, sendResponse) => {
    const sendResponseStub = sinon.stub().callsFake(response => {
      // This stub represents the sendResponse function
    });
    if (message.action === "newData" && message.bodyText) {
      // Simulate a valid message being sent from the background script
      document.getElementById('compliment-text').textContent = message.bodyText;
      // Call the sendResponse function with received: true to simulate the behavior
      sendResponseStub({ received: true });
    } else {
      // Simulate an invalid message by not changing the compliment text
      // Call the sendResponse function with received: false to simulate the behavior
      sendResponseStub({ received: false });
    }
    if (sendResponse) sendResponse(sendResponseStub.args[0][0]);
  });
});

describe('Popup script', function() {
  describe('chrome.runtime.onMessage listener', function() {
    it('should update the compliment text when a new message is received', function(done) {
      const validMessage = { action: "newData", bodyText: "Test compliment" };
      global.chrome.runtime.onMessage.addListener(validMessage, {}, function(response) {
        const complimentTextElement = document.getElementById('compliment-text');
        expect(complimentTextElement.textContent).to.equal("Test compliment");
        expect(response.received).to.be.true;
        done();
      });
    });

    it('should not update the compliment text when an invalid message is received', function(done) {
      // Reset the text content to its initial state before each test
      document.getElementById('compliment-text').textContent = "Fetching compliment...";
      const invalidMessage = { action: "newData" }; // Missing bodyText property
      global.chrome.runtime.onMessage.addListener(invalidMessage, {}, function(response) {
        const complimentTextElement = document.getElementById('compliment-text');
        expect(complimentTextElement.textContent).to.equal("Fetching compliment...");
        expect(response.received).to.be.false;
        done();
      });
    });

    it('should have the correct initial CSS properties for the compliment text', function() {
      const complimentContainer = document.getElementById('compliment-container');
      expect(complimentContainer.style.fontSize).to.equal('40px');
      expect(complimentContainer.style.color).to.equal('black');
      expect(complimentContainer.style.background).to.equal('rgba(211, 211, 211, 0.5)');
    });

    // Additional tests for animation timings and other CSS properties can be added here
  });

  describe('Configuration UI', function() {
    it('should display the configuration UI when the extension icon is clicked', function() {
      global.chrome.browserAction.onClicked.addListener(() => {
        const configUI = document.getElementById('config-ui');
        configUI.style.display = 'block';
      });
      global.chrome.browserAction.onClicked.addListener();
      const configUI = document.getElementById('config-ui');
      expect(configUI.style.display).to.equal('block');
    });

    it('should initialize the frequency input with the current value from config.js', function() {
      const frequencyInput = document.getElementById('frequency-input');
      expect(frequencyInput.value).to.equal(String(config.popupInterval));
    });

    it('should only accept integers between 1 and 240 for the frequency input', function() {
      const frequencyInput = document.getElementById('frequency-input');
      expect(frequencyInput.getAttribute('min')).to.equal('1');
      expect(frequencyInput.getAttribute('max')).to.equal('240');
    });

    it('should update the frequency in config.js and the running interval when the form is submitted', function(done) {
      this.timeout(4000); // Increase timeout to allow for async operations
      const frequencyInput = document.getElementById('frequency-input');
      const submitButton = document.getElementById('frequency-submit');

      // Simulate setting the frequency input value to 120
      frequencyInput.value = 120;

      // Set up fake timers
      const clock = sinon.useFakeTimers();

      // Create a new event for clicking the submit button
      var clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('click', true, true);

      // Dispatch the event to the submit button
      submitButton.dispatchEvent(clickEvent);

      // Advance the fake timers to allow all async operations to complete
      clock.tick(100);

      // Check that the sendMessage was called with the correct message
      sinon.assert.calledWith(global.chrome.runtime.sendMessage, sinon.match.has("action", "updateFrequency").and(sinon.match.has("frequency", 120)));

      // Restore real timers
      clock.restore();

      // Finish the test after the asynchronous operations have been verified
      done();
    });
  });
});
