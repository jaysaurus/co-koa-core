const ClientConfigFactory = require('../lib/ClientConfigFactory.js');
const mockRoot = '../../__mocks__'
describe('ClientConfigFactory integration test (incorporating ClientConfigFactoryHelper & ClientConfig)', () => {
  const config = ClientConfigFactory(mockRoot);

  test('build returns a valid new instance of client config', () => {
    const success = config.build('test');
    const comparison = {
      env: 'test',
      environment: 'test',
      i18n: 'en',
      messageFolder: `${mockRoot}/i18n/`,
      root: mockRoot }
    Object.keys(comparison).forEach(key => {
      expect(success).toHaveProperty(key);
      expect(success[key]).toBe(comparison[key]);
    });
    expect(success.logger).toHaveProperty('log');
    expect(typeof success.logger.log).toBe('function');
    expect(success.logger).toHaveProperty('error');
    expect(success.logger.error).toBe(console.error);
  });

  test('build is supplied an invalid environment', () => {
    messages = require('../lib/i18n/en.confManMessages.json')
    expect(() => {
      config.build(null);
    }).toThrow('Failed to create system logger, please check your Logger.js file');
  });

  test('build cannot find a component of the loaded helper object', () => {
    jest.mock('../lib/helpers/ClientConfigFactoryHelper.js');
    const ClientConfigFactory1 = require('../lib/ClientConfigFactory.js');
    try {
    const config = ClientConfigFactory(mockRoot).build(1);
  } catch (e) {
    console.log(e.message)
  }
  });

  test('quick cover of ClientConfig as an empty object', () => {
    ClientConfig = require('../lib/ClientConfig.js')
    clientConf = ClientConfig();
    Object.keys(clientConf).forEach(key => {
      if (key != 'welcomeMessage') {
        expect(clientConf[key]).toBeNull();
      }
    });
  })
});
