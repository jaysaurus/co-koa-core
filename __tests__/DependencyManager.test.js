const DependencyManager = require('../lib/DependencyManager.js');
require('../lib/helpers/DependencyManagerHelper.js')
jest.mock('../lib/helpers/DependencyManagerHelper.js')

describe('DependencyManager test', () => {
  test('.call() token request returns helper token call', () => {
    const spy = []
    const $ = DependencyManager(spy)
    expect($.call(':test')).toBe('Token fetched');
    expect(spy[0]).toBe('appendConfigToCallerMethod called');
  });
  test('.call() file request returns helper file call', () => {
    const $ = DependencyManager([]);
    expect($.call('File')).toBe('File fetched');
  });
  test('.call() unsupported item request', () => {
    const spy = [];
    const $ = DependencyManager(spy);
    $.call('duff');
    expect(spy[1]).toBe('unsupported');
    expect(spy[2]).toBe('duff');
  });
  test('.call() invalid type supplied', () => {
    const spy = [];
    const $ = DependencyManager(spy);
    $.call(1);
    expect(spy[1]).toBe('invalidType');
    expect(spy[2]).toBe('number');
  });
  test('.call() thrown exceptions are caught and handled', () => {
    spy = ['override'];
    const $ = DependencyManager(spy);
    $.call();
    expect(spy[1]).toBe('invalidDependency');
    expect(spy[2]).toBe('test');
    expect(spy[3].toString()).toEqual('Error: test');
  });
});
