const CoreConfig = require('../lib/CoreConfig.js');
const mockRoot = '../../__mocks__'
describe('CoreConfig integration test (incorporating CoreConfigHelper & ClientConfig)', () => {
  const config = CoreConfig(mockRoot);

  test('build returns a valid new instance of client config', () => {
    const success = config.build('test');
    const comparison = {
      env: 'test',
      environment: 'test',
      i18n: 'en',
      logger: console.log,
      messageFolder: `${mockRoot}/i18n/`,
      root: mockRoot,
      useHBS: true }
    Object.keys(comparison).forEach(key => {
      expect(success).toHaveProperty(key);
      expect(success[key]).toBe(comparison[key]);
    });
  });

  test('build is supplied an invalid environment', () => {
    messages = require('../lib/i18n/en.confManMessages.json')
    expect(() => {
      config.build(null);
    }).toThrow(messages.fatalError);
  });

  test('build cannot find i18n for exception helper does not have relevant message', () => {
    jest.mock('../lib/helpers/CoreConfigHelper.js');
    const config = CoreConfig(mockRoot);
    expect(() => {
      config.build(1);
    }).toThrow('FATAL: Something went fatally wrong, ConfigManager could not find it\'s messages AND config.json was not understood. Your Co.Koa installation may have become corrupted.');
  });

  test('build cannot find a component of the loaded helper object', () => {
    jest.mock('../lib/helpers/CoreConfigHelper.js');
    const config = CoreConfig(mockRoot);

    expect(() => {
      config.build('test')
    }).toThrow('failed: Mock getEnvConfig threw an exception');
  });

  test('quick cover of ClientConfig as an empty object', () => {
    ClientConfig = require('../lib/ClientConfig.js')
    clientConf = ClientConfig();
    Object.keys(clientConf).forEach(key => {
      expect(clientConf[key]).toBeNull();
    });
  })
});
