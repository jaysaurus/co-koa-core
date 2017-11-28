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
      expect(clientConf[key]).toBeNull();
    });
  })
});
