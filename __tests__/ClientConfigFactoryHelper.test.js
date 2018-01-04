const ClientConfigFactoryHelper = require('../lib/helpers/ClientConfigFactoryHelper');

describe('ClientConfigFactoryHelper tests', () => {
  const config = ClientConfigFactoryHelper('../../__mocks__');
  test(
    'getEchoObject with valid env returns valid echo', () => {
      const success = config.getEchoObject('test');

      expect(success).toHaveProperty('error');
      expect(success).toHaveProperty('log');
      expect(success).toHaveProperty('raw');
      expect(success).toHaveProperty('throw');
  });

  test(
    'getEchoObject null env throws exception', () => {
      expect(() => {
        config.getEchoObject(null);
      }).toThrow('Failed to create system logger, please check your Logger.js file');
  });

  test('ClientConfigFactory defaults to en with no supportedLanguages', () => {
    const config2 = ClientConfigFactoryHelper('../../__mocks__/config');
    const success = config2.getEchoObject('test');    
    expect(success).toHaveProperty('error');
    expect(success).toHaveProperty('log');
    expect(success).toHaveProperty('raw');
    expect(success).toHaveProperty('throw');
  });

  test(
    'getEchoObject invlid env throws exception', () => {
      const echo = config.getEchoObject('invalid');
      expect(() => {
        echo.log('this will fail');
      }).toThrow('Co.Koa Logger does not recognise the environment: "invalid"; check config.json and logger.js are both correct');
  });

  test(
    'envConfig initialised correctly', () => {
      const success = config.getEnvConfig('test');

      expect(success).toBe('test');
  });

  test(
    'envConfig passed invalid environment', () => {
      const _spy = [];
      const mockEcho = { throw: (string) => { _spy.push(string); } }
      const error = config.getEnvConfig(false, mockEcho);

      expect(_spy.length).toBe(1);
      expect(_spy[0]).toBe('invalidEnv');
  });
});
