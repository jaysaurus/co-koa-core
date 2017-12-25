const AssetFactory = require('../lib/helpers/resources/AssetFactory');
// jest.mock('../lib/helpers/resources/AssetConfig.default.js');``
jest.mock('fs');
describe('AssetFactory integration tests', () => {
  mockEcho = spy => { return { error (m) { spy.push(m) }, throw (m) { spy.push(m) } } }
  test('AssetFactory.stream returns fs stream call', () => {
    const spy = [];
    const fakeDir = `${__dirname.replace('tests__','mocks__')}`
      const result =
        AssetFactory(
          { environment: 'test', root: fakeDir },
          mockEcho(spy))
          .build(':css')
          .stream('someData');
      expect(result).toBe(`${fakeDir}/public/css/someData.css`);
  });
});
