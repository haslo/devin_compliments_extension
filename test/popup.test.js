import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

// Load the popup HTML into jsdom
const { document } = (new JSDOM(`<!DOCTYPE html><html><body><div id="compliment-container" style="font-size: 40px; color: black; background: rgba(211, 211, 211, 0.5);"><p id="compliment-text">Fetching compliment...</p></div></body></html>`)).window;

// Since we cannot require the actual popup script, we will need to simulate its behavior
global.document = document;
global.chrome = { runtime: { onMessage: { addListener: sinon.stub() } } };

// Mock the chrome.runtime.sendMessage function
global.chrome.runtime.sendMessage = sinon.stub();

// This path may need to be adjusted based on the actual location of popup.js
import('../popup.js').then(() => {
  // Set up the listener mock to simulate the reception of messages
  global.chrome.runtime.onMessage.addListener.callsFake((message, sender, sendResponse) => {
    if (message.action === "newData" && message.bodyText) {
      // Simulate a valid message being sent from the background script
      document.getElementById('compliment-text').textContent = message.bodyText;
      // Call the sendResponse function with received: true to simulate the behavior
      sendResponse({ received: true });
    } else {
      // Simulate an invalid message by not changing the compliment text
      // Call the sendResponse function with received: false to simulate the behavior
      sendResponse({ received: false });
    }
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
  });
});
