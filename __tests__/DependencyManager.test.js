const DependencyManager = require('../lib/DependencyManager.js');
// require('../lib/helpers/DependencyManagerHelper.js')
jest.mock('../lib/helpers/DependencyManagerHelper.js')

describe('DependencyManager test', () => {
  test('.call() token request returns helper token call', () => {
    const spy = []
    const $ = DependencyManager({ conf: spy })
    expect($.call(':test')).toBe('Token fetched');
  });
  test('.call() file request returns helper file call', () => {
    const $ = DependencyManager([]);
    expect($.call('File')).toBe('File fetched');
  });
  test('.call() unsupported item request', () => {
    const spy = [];
    const $ = DependencyManager({ conf: spy });
    $.call('duff');
    expect(spy[0]).toBe('unsupported');
    expect(spy[1]).toBe('duff');
  });
  test('.call() invalid type supplied', () => {
    const spy = [];
    const $ = DependencyManager({ conf: spy });
    $.call(1);
    expect(spy[0]).toBe('invalidType');
    expect(spy[1]).toBe('number');
  });
  test('.call() thrown exceptions are caught and handled', () => {
    spy = ['override'];
    const $ = DependencyManager({ conf: spy });
    $.call(1);
    expect(spy[1]).toBe('invalidType');
    expect(spy[2]).toBe('number');
    expect(spy[3]).toBe('invalidDependency');
    expect(spy[4]).toBe('invalidType');
    expect(spy[5].toString()).toEqual('Error: invalidType');
  });
});
