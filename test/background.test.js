import { expect } from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { fetchData } from '../background.js'; // Import fetchData from the background script

// Since we cannot require the actual background script, we will need to simulate its behavior
global.fetch = fetch; // Mock fetch globally

// Initialize global.chrome with a structure that supports sendMessage
global.chrome = {
  runtime: {
    sendMessage: sinon.stub().callsFake((message, callback) => {
      if (callback) callback();
    })
  }
};

describe('Background script', function() {
  let fetchStub;

  beforeEach(function() {
    // Restore fetchStub if it exists, otherwise create a new stub for global.fetch
    if (fetchStub && typeof fetchStub.restore === 'function') {
      fetchStub.restore();
    }
    fetchStub = sinon.stub(global, 'fetch');
    // Reset history for sendMessage stub
    if (global.chrome.runtime.sendMessage && typeof global.chrome.runtime.sendMessage.resetHistory === 'function') {
      global.chrome.runtime.sendMessage.resetHistory();
    } else {
      global.chrome.runtime.sendMessage = sinon.stub().callsFake((message, callback) => {
        if (callback) callback();
      });
    }
  });

  afterEach(function() {
    // Restore the stub to its original state
    fetchStub.restore();
    if (global.chrome.runtime.sendMessage && typeof global.chrome.runtime.sendMessage.restore === 'function') {
      global.chrome.runtime.sendMessage.restore();
    }
  });

  describe('fetchData function', function() {
    it('should call the API and send a message with the fetched data', async function() {
      const fakeResponse = Promise.resolve({ json: () => Promise.resolve({ body: 'Test body content' }) });
      fetchStub.returns(fakeResponse);

      // Simulate the fetchData function call
      await fetchData(); // fetchData would be the function from background.js that we are testing

      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal('https://jsonplaceholder.typicode.com/posts/1');

      // Since fetchData uses .then, we need to wait for the next tick
      await new Promise(process.nextTick);

      expect(global.chrome.runtime.sendMessage.calledOnce).to.be.true;
      expect(global.chrome.runtime.sendMessage.firstCall.args[0]).to.deep.equal({ action: "newData", bodyText: 'Test body content' });
    });

    it('should not send a message if the fetch fails due to a network error', async function() {
      const fakeError = Promise.reject(new Error('Network Error'));
      fetchStub.returns(fakeError);

      // Simulate the fetchData function call
      await fetchData();

      // Since fetchData uses .catch, we need to wait for the next tick
      await new Promise(process.nextTick);

      expect(fetchStub.calledOnce).to.be.true;
      expect(global.chrome.runtime.sendMessage.notCalled).to.be.true;
    });

    it('should not send a message if the response does not contain the expected body field', async function() {
      const fakeResponse = Promise.resolve({ json: () => Promise.resolve({}) }); // Empty response object
      fetchStub.returns(fakeResponse);

      // Simulate the fetchData function call
      await fetchData();

      // Since fetchData uses .then, we need to wait for the next tick
      await new Promise(process.nextTick);

      expect(fetchStub.calledOnce).to.be.true;
      expect(global.chrome.runtime.sendMessage.notCalled).to.be.true;
    });
  });
});
