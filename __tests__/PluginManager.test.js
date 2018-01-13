const PluginManager = require('../lib/PluginManager');

describe('tests for PluginManager', () => {
  let spy = [];
  let logCalled = false;
  let errorCalled = false;
  const conf = {
    corei18n: 'en',
    logger: {
      log (item) {
        logCalled = true;
        spy.push(item);
      },
      error (item) {
        errorCalled = true;
        spy.push(item);
      }
    }
  }
  test('valid plugins are actioned', () => {
    const pluginManager = PluginManager(conf);
    const pluginSpy = [];
    pluginManager.init(pluginSpy, 'dependencyManager call pointer', { init: (app, dm) => {
      app.push(dm);
    } });
    expect(logCalled).toBe(true)
    expect(pluginSpy[0]).toBe('dependencyManager call pointer');
    expect(spy[0]).toBe('success');
    expect(spy[1]).toBe(1);
    expect(spy[2]).toBe(1);
  });
  test('invalid plugin not an object', () => {
    spy = [];
    const pluginManager = PluginManager(conf);
    pluginManager.init(null, 'dependencyManager call pointer', 1);
    expect(errorCalled).toBe(true);
    expect(spy[0]).toBe('failed');
    expect(spy[1]).toBe('Error');
    expect(spy[2]).toBe('[object Object]: ');
    expect(spy[3]).toBe('success');
    expect(spy[4]).toBe(0);
    expect(spy[5]).toBe(1);
  });
  test('invalid plugin duff object', () => {
    spy = [];
    errorCalled = false
    const pluginManager = PluginManager(conf);
    pluginManager.init(null, 'dependencyManager call pointer', { noInit: 'uhoh' });
    expect(errorCalled).toBe(true);
    expect(spy[0]).toBe('failed');
    expect(spy[1]).toBe('Error');
    expect(spy[2]).toBe('[object Object]: ');
    expect(spy[3]).toBe('success');
    expect(spy[4]).toBe(0);
    expect(spy[5]).toBe(1);
  });
});
