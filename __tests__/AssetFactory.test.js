const AssetFactory = require('../lib/helpers/resources/AssetFactory');
jest.mock('../lib/helpers/resources/AssetConfig.default.js');

describe('AssetFactory tests both with default and without', () => {
  mockEcho = spy => { return { error (m) { spy.push(m) }, throw (m) { spy.push(m) } } }
  test('fetch test css url using mock conf', () => {
      const result =
        AssetFactory({ environment: 'test', root: __dirname.replace('__tests__', '__mocks__') })
          .build(':css')
          .loadURL('test');
      expect(result).toBe('/public/css/test.css');
    });
  test('fetch test css url using default mock conf', () => {
    const spy = [];
      const result =
        AssetFactory({ environment: 'test', root: 'invalid root' },
          mockEcho(spy))
          .build(':css')
          .loadURL('test');
      expect(result).toBe('/mocked/css/test.css');
      expect(spy.length).toBe(1);
      expect(spy[0]).toBe('missingAssetConfig');
    });
  test('fetch css url throws an exception with an invalid environment and the default config', () => {
      const spy = [];
      const result =
        AssetFactory(
          { environment: 'invalid environment', root: 'invalid root' },
          mockEcho(spy))
          .build(':css')
          .loadURL('test');
      expect(spy.length).toBe(2);
      expect(spy[0]).toBe('missingAssetConfig');
      expect(spy[1]).toBe('invalidAsset');
    });
});
