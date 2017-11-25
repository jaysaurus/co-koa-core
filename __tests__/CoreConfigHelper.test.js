const CoreConfigHelper = require('../lib/CoreConfigHelper');

describe('CoreConfigHelper tests', () => {
  const config = CoreConfigHelper('../__mocks__');
  test(
    'getEchoObject with valid env returns valid echo', () => {
      const success = config.getEchoObject('test');

      expect(success).toHaveProperty('error');
      expect(success).toHaveProperty('log');
      expect(success).toHaveProperty('raw');
      expect(success).toHaveProperty('throw');
  });
  test(
    'getEchoObject invlid env returns undefined', () => {
      const error = config.getEchoObject(null);

      expect(error).toBeUndefined();
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
