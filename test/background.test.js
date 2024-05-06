import { expect } from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';

// Since we cannot require the actual background script, we will need to simulate its behavior
global.fetch = fetch; // Mock fetch globally

// Initialize global.chrome with a structure that supports sendMessage and other APIs used in background.js
global.chrome = {
  runtime: {
    sendMessage: sinon.stub().callsFake((message, callback) => {
      if (callback) callback();
    }),
    onMessage: {
      addListener: sinon.stub()
    }
  },
  storage: {
    sync: {
      get: sinon.stub().callsFake((key, callback) => {
        if (callback) callback({ popupInterval: 1 }); // Assuming default popupInterval is 1 minute
      }),
      set: sinon.stub().callsFake((obj, callback) => {
        if (callback) callback();
      })
    }
  },
  alarms: {
    create: sinon.stub(),
    clear: sinon.stub()
  }
};

// Delayed import of background.js functions
let fetchData, init;

before(async function() {
  // Mocks are already set up here
  // Now, dynamically import the background.js module which uses the chrome API
  const background = await import('../background.js');
  fetchData = background.fetchData;
  init = background.init;
});

describe('Background script', function() {
  let fetchStub;
  let setIntervalStub;
  let clearIntervalStub;

  beforeEach(function() {
    // Restore fetchStub if it exists, otherwise create a new stub for global.fetch
    if (fetchStub && typeof fetchStub.restore === 'function') {
      fetchStub.restore();
    }
    fetchStub = sinon.stub(global, 'fetch');

    // Setup fetchStub to return a promise that resolves to an object with a json method
    fetchStub.returns(Promise.resolve({
      json: () => Promise.resolve({ compliment: 'Test compliment content' })
    }));

    // Stub setInterval and clearInterval
    setIntervalStub = sinon.stub(global, 'setInterval');
    clearIntervalStub = sinon.stub(global, 'clearInterval');

    // Reset history for all stubs in global.chrome
    for (const api in global.chrome) {
      for (const method in global.chrome[api]) {
        if (typeof global.chrome[api][method].resetHistory === 'function') {
          global.chrome[api][method].resetHistory();
        }
      }
    }
  });

  afterEach(function() {
    // Restore the stubs to their original state
    fetchStub.restore();
    setIntervalStub.restore();
    clearIntervalStub.restore();
    for (const api in global.chrome) {
      for (const method in global.chrome[api]) {
        if (typeof global.chrome[api][method].restore === 'function') {
          global.chrome[api][method].restore();
        }
      }
    }
  });

  describe('fetchData function', function() {
    it('should call the API and send a message with the fetched data', async function() {
      // Simulate the fetchData function call
      await fetchData(); // fetchData would be the function from background.js that we are testing

      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal('https://complimentsapi-274811442e1d.herokuapp.com/compliment');

      // Since fetchData uses .then, we need to wait for the next tick
      await new Promise(process.nextTick);

      expect(global.chrome.runtime.sendMessage.calledOnce).to.be.true;
      expect(global.chrome.runtime.sendMessage.firstCall.args[0]).to.deep.equal({ action: "newData", bodyText: 'Test compliment content' });
    });

    it('should not send a message if the fetch fails due to a network error', async function() {
      fetchStub.returns(Promise.reject(new Error('Network Error')));

      // Simulate the fetchData function call
      await fetchData();

      // Since fetchData uses .catch, we need to wait for the next tick
      await new Promise(process.nextTick);

      expect(fetchStub.calledOnce).to.be.true;
      expect(global.chrome.runtime.sendMessage.notCalled).to.be.true;
    });

    it('should not send a message if the response does not contain the expected body field', async function() {
      fetchStub.returns(Promise.resolve({
        json: () => Promise.resolve({})
      })); // Empty response object

      // Simulate the fetchData function call
      await fetchData();

      // Since fetchData uses .then, we need to wait for the next tick
      await new Promise(process.nextTick);

      expect(fetchStub.calledOnce).to.be.true;
      expect(global.chrome.runtime.sendMessage.notCalled).to.be.true;
    });
  });

  describe('Interval and immediate call', function() {
    it('should set an interval to call fetchData', function(done) {
      // The interval should be set using the value from config.js
      // Since we cannot require config.js directly, we will assume the interval is 1 minute for this test
      const expectedInterval = 60000;

      // Simulate the script initialization which should trigger the setInterval call
      init();

      // Use process.nextTick to wait for the next tick of the event loop,
      // ensuring that setInterval has been called
      process.nextTick(() => {
        try {
          sinon.assert.calledWith(setIntervalStub, fetchData, expectedInterval);
          done();
        } catch (error) {
          done(error);
        }
      });
    });

    it('should call fetchData immediately when the script is loaded', function() {
      // Simulate the script initialization which should trigger the immediate call to fetchData
      init();

      sinon.assert.called(fetchStub);
    });
  });
});
