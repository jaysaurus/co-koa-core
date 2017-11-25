const mockingoose = require('mockingoose');
const ConfigManager = require('../.core/ConfigManager');


describe('configeration setup for Co.Koa', () => {
  jest.mock('../config/Logger.js');

  beforeEach(() => {
    require('mongoose');
  })

  test('echo object is not defined because of exception', () => {
    jest.mock('../.core/handlers/EchoHandler.js');
    const configManager = new ConfigManager(__dirname.replace('/__tests__',''));
    let message = '';
    try {
      configManager.build('throwOnEcho'); // echo object will not be returned
    } catch (e) {
      message = e.message;
    }
    expect(message).toBe('FATAL: failed to retrieve messages for config, check your "environment" and "defaultLanguage" variables!');
  })

  test('a config object is manufactured', () => {
    const configManager = new ConfigManager(__dirname.replace('/__tests__',''));
    const conf = configManager.build('test');

    expect(conf).toHaveProperty('environment')
    expect(conf.environment).toBe('test')
    expect(conf).toHaveProperty('i18n')
    expect(conf.i18n).toBe('en');
    expect(conf).toHaveProperty('logger');
    expect(conf.logger.log()).toBe('logger called');
    expect(conf).toHaveProperty('env');
    expect(typeof conf.env.mongoose).toBe('object');
  });

  test('invalidEnv exception is thrown', () => {
    const confManager = new ConfigManager(__dirname.replace('/__tests__',''));
    let message = '';
    try {
      confManager.build('duff');
    } catch (e) {
      message = e.message
    }
    expect(message).toMatch('Invalid environment detected');
    expect(message).toMatch('Failed to build config object: ');
  });

  // needs to run after other tests as mucks up confManMessages.json object.
  test('config object really screwed up, corrupt config and configMessage', () => {
    jest.mock('../.core/handlers/EchoHandler.js');
    jest.mock('../.core/i18n/en.confManMessages.json', () => {
      return {};
    }, { virtual: true })
    const configManager = new ConfigManager(__dirname.replace('/__tests__',''));
    try {
      configManager.build('throwOnEcho'); // echo object will not be returned
    } catch (e) {
      message = e.message;
    }
    expect(message).toBe('FATAL: Something went fatally wrong, ConfigManager could not find it\'s messages AND config.json was not understood. Your Co.Koa installation may have become corrupted.');
  });
});
