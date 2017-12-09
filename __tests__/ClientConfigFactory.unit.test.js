const ClientConfigFactory = require('../lib/ClientConfigFactory.js');
const mockRoot = '../../__mocks__'

jest.mock('../lib/helpers/ClientConfigFactoryHelper.js');
describe('ClientConfigFactory integration test (incorporating ClientConfigFactoryHelper & ClientConfig)', () => {
  const config = ClientConfigFactory(mockRoot);

  test('build clientConfig is supplied a duff helper', () => {
    expect(() => { config.build('test'); })
      .toThrow('failed: Mock getEnvConfig threw an exception');
  });
  test('build clientConfig has an invalid echo object', () => {
    expect(() => { config.build(1); })
      .toThrow('FATAL: Something went fatally wrong, ConfigManager could not find it\'s messages AND config.json was not understood. Your Co.Koa installation may have become corrupted.');
  });
  test('build clientConfig is supplied a helper that handles a fatalError', () => {
    expect(() => { config.build(undefined); })
      .toThrow('Something went really wrong');
  });
});
