const echoHandler = require('echo-handler');
const mongoose = require('mongoose');

jest.mock('mongoose');
jest.mock('../lib/helpers/resources/AsyncLibrary.js');
jest.mock('../lib/helpers/resources/AssetFactory.js');

const TreeAlgorithm = require('../lib/helpers/resources/TreeAlgorithm.js');

const DependencyManagerHelper = require('../lib/helpers/DependencyManagerHelper.js');

describe('DependencyManagerHelper tests', () => {

  const libRoot = __dirname.replace('__tests__', 'lib');
  const echo = echoHandler.configure({
    factoryOverride: `${libRoot}/i18n/en.depManMessages.json`,
    logger: console });
  const mockParent = { call: {} };
  const helper = DependencyManagerHelper({
    env: { mongoDB_URI: 'something' },
    factoryOverride: `${libRoot}/i18n/en.depManMessages.json`,
    logger: console,
    i18n: 'en',
    root: '../../__mocks__',
    useMongoose: true
  }, libRoot, mockParent);

  test('appendConfigToCallerMethod tests', () => {
    // if environment set the method exits elegantly
    mockParent.call.environment = 'not undefined'
    helper.appendConfigToCallerMethod();
    expect(mockParent.call).toEqual({ environment: 'not undefined' });
    delete mockParent.call.environment

    // if no environment, config is injected
    helper.appendConfigToCallerMethod();
    expect(mockParent.call).toHaveProperty('root');
    expect(mockParent.call.root).toBe('../../__mocks__');
    expect(mockParent.call).toHaveProperty('i18n');
    expect(mockParent.call.i18n).toBe('en');
  });

  test('fetchFile calls getter and returns FakeService.js', () => {
    mockParent.call.mock = 'Mock from dependencyManager';
    const service = helper.fetchFile('Service', 'MockService')
    expect(service.mock).toBe(mockParent.call.mock);
    delete mockParent.call.mock;
  });

  test('fetchFile fails to call parent', () => {
    expect(() => {
      helper.fetchFile('Service', 'duffService')
    }).toThrow(echo.raw('invalidDependencyFile', 'Service', 'duffService'));
  });

  test('fetchFile calls getter and returns FakeValidator.js', () => {
    mockParent.call.mock = 'Mock from dependencyManager';
    const validator = helper.fetchFile('Validator', 'MockValidator')
    expect(validator.mock).toBe(mockParent.call.mock);
    delete mockParent.call.mock;
  });

  test('fetchFile calls mongoose model', () => {
    expect(helper.fetchFile('mock','mock')).toBe('I am a mock model');
  });

  test('fetchToken fetches tokens', () => {
    expect(helper.fetchToken(':async')).toBe('AsyncLibrary returned');
    ['error','log','raw','throw'].forEach(prop => {
      expect(helper.fetchToken(':echo')).toHaveProperty(prop);
    });
    expect(helper.fetchToken(':enums').mock[0]).toBe('a');
    const result = helper.fetchToken(':somethingElse')
    expect(result).toBe(':somethingElse');
    expect(helper.fetchToken(':tree')).toBe(TreeAlgorithm);
  });

  test('getter throws an exception', () => {
    expect(() => {
      helper.getter('Whatever', 'Invalid');
    }).toThrow(echo.raw('failed', 'Invalid'));
  })

  test('small duff init test for coverage completeness', () => {
    expect(() =>{ DependencyManagerHelper() }).toThrow();
  })

  test('provision for disabling mongoose and using custom model', () => {
    const helper = DependencyManagerHelper({
      env: { mongoDB_URI: 'something' },
      factoryOverride: `${libRoot}/i18n/en.depManMessages.json`,
      logger: console,
      i18n: 'en',
      root: '../../__mocks__',
      useMongoose: false
    }, libRoot, mockParent);
    let getterCalled = false;
    helper.getter = function (a, b) {
      getterCalled = true;
    }
    let parseInstanceCalled = false;
    helper.parseInstance = function (a, b, c) {
      parseInstanceCalled = true;
    }
    // defer to same behaviour as services above
    const nonMongooseModel = helper.fetchFile('mock','mock')
    expect(getterCalled).toBe(true);
    expect(parseInstanceCalled).toBe(true);
  });
});
