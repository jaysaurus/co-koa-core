const echoHandler = require('echo-handler');

jest.mock('../lib/helpers/resources/AsyncLibrary.js');
jest.mock('../lib/helpers/resources/AssetFactory.js');
jest.mock('../lib/Builder.js');

const TreeAlgorithm = require('../lib/helpers/resources/TreeAlgorithm.js');
const DependencyManagerHelper = require('../lib/helpers/DependencyManagerHelper.js');

describe('DependencyManagerHelper tests', () => {
  const app = {
    _modelRegister: {

    }
  }
  const libRoot = __dirname.replace('__tests__', 'lib');
  const echo = echoHandler.configure({
    factoryOverride: `${libRoot}/i18n/en.depManMessages.json`,
    logger: console });
  const mockParent = { call: {} };
  const helper = DependencyManagerHelper({ conf: {
    corei18n: 'en',
    env: { mongoDB_URI: 'something' },
    factoryOverride: `${libRoot}/i18n/en.depManMessages.json`,
    logger: console,
    i18n: 'en',
    root: '../../__mocks__',
    app
  }, libRoot, parent: mockParent, app });

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

  test('getter throws an exception', () => {
    expect(() => {
      helper.getter('Whatever', 'Invalid');
    }).toThrow(echo.raw('failed', 'Invalid'));
  })

  test('fetchFile calls different types of models based on app property', () => {
    helper.getter = (type, item) => {
      return type
    }
    helper.parseInstance = (getter, type, item) => {
      return {
        _modelType: 'mongoose'
      }
    }
    app._modelRegister.mongoose = itemName => { return `I returned custom ${itemName}`}
    expect(helper.fetchFile('mock','mock')).toBe('I returned custom mock');

    helper.parseInstance = (getter, type, item) => {
      return {
        foo: 'no _modelType'
      }
    }
    expect(helper.fetchFile('mock','mock')).toEqual({ foo: 'no _modelType'});
  });

  test('fetchFile defers to base model if modelRegister callback returns undefined', () => {
    helper.getter = (type, item) => {
      return type
    }
    helper.parseInstance = (getter, type, item) => {
      return {
        _modelType: 'mongoose'
      }
    }
    app._modelRegister.mongoose = itemName => { return undefined }
    expect(helper.fetchFile('mock','mock')).toEqual({ _modelType: 'mongoose' });
  });


  test('fetchFile receives invalid _modelRegister callback', () => {
    const spy = []
    helper.echo = {
      error: (arg1, arg2) => {
        spy.push(arg1);
        spy.push(arg2);
      }
    }
    helper.getter = (type, item) => {
      return type
    }
    helper.parseInstance = (getter, type, item) => {
      return {
        _modelType: 'mongoose'
      }
    }
    app._modelRegister.mongoose = itemName => { throw new Error('failed') }
    helper.fetchFile('mock', 'mock')
    expect(spy[0]).toBe('invalidModelDefinition')
    expect(spy[1]).toBe('failed')
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
    expect(helper.fetchToken(':builder')).toHaveProperty('build')
  });


  // test('provision for disabling mongoose and using custom model', () => {
  //   const helper = DependencyManagerHelper({
  //     env: { mongoDB_URI: 'something' },
  //     factoryOverride: `${libRoot}/i18n/en.depManMessages.json`,
  //     logger: console,
  //     i18n: 'en',
  //     root: '../../__mocks__',
  //     useMongoose: false
  //   }, libRoot, mockParent);
  //   let getterCalled = false;
  //   helper.getter = function (a, b) {
  //     getterCalled = true;
  //   }
  //   let parseInstanceCalled = false;
  //   helper.parseInstance = function (a, b, c) {
  //     parseInstanceCalled = true;
  //   }
  //   // defer to same behaviour as services above
  //   const nonMongooseModel = helper.fetchFile('mock','mock')
  //   expect(getterCalled).toBe(true);
  //   expect(parseInstanceCalled).toBe(true);
  // });
});
