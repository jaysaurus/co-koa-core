global.__root = __dirname.replace('/__tests__','');
process.env.NODE_ENV = 'test';
ConfigManager = require(`../.core/ConfigManager`);
global.__i18n = 'en'; // force i18n to be english for sake of tests.
const logSpy = []
const conf = new ConfigManager(__dirname.replace('/__tests__','')).build('test', logSpy);

// MOCKS
jest.mock('../.core/handlers/AssetHandler.js');
jest.mock('../.core/handlers/EchoHandlerFactory.js');
jest.mock('../.core/handlers/EnumHandler.js');
jest.mock('../.core/handlers/MongooseHandler.js');

// VIRTUALS
jest.mock('../api/services/FakeService', () => {
  return function ($) {
    this.test = 'Service called by dependencyManager';
  };
}, {virtual: true});

jest.mock('../api/models/validators/FakeValidator', () => {
  return function ($) {
    return 'Validator called by dependencyManager';
  };
}, {virtual: true});

jest.mock('../api/models/Fake', () => {
  return function($) {
    return 'Model called by dependencyManager';
  }
}, {virtual: true});

describe('DependencyManager test', () => {
  // TESTS
  const DependencyManager = require(`../.core/DependencyManager`);
  const $ = new DependencyManager(conf).call;
  test('$(":async") should return a new async token dependency', () => {
    const _async = $(':async');
    expect(_async).toHaveProperty('each');
    expect(_async).toHaveProperty('reduce');
    expect(typeof _async.each).toBe('function');
    expect(typeof _async.reduce).toBe('function');
  });

  test('$(":enums") should return a new enum token dependency', () => {
    const _enums = $(':enums');
    expect(_enums.test).toBe('enums mock object is assigned');
  })

  test('$(":shema") should return a mongoose.types object with a create method bolted on', () => {
    const _schema = $(':schema');
    expect(typeof _schema.create).toBe('function');
  })

  test('$(":html") should return a mocked asset by supplied type', () => {
    const _asset = $(':html');
    expect(_asset).toBe('asset mock function is called');
  });

  test('$("FakeMessages") should return the mocked service factory', () => {
    const FakeMessage = $('FakeMessages');
    expect(FakeMessage.result).toBe('EchoHandlerFactory was called');
  })

  test('$("FakeService") should return a mocked service instance', () => {
    const FakeService = $('FakeService');
    expect(FakeService.test).toBe('Service called by dependencyManager');
  });

  test('$("NotRealService") should throw an exception at getter level because it does not exist', () => {
    var message = '';
    try {
      $('NotRealService');
    } catch (e) {
      message = e.message;
    }
    expect(() => { $('NotRealService'); }).toThrow();
    expect(message).toMatch('Failed to load NotRealService');
  });

  test('$("NotRealService") should throw an exception at dependencyManager level because it does not exist', () => {
    var message = '';
    try {
      $('NotRealService');
    } catch (e) {
      message = e.message;
    }
    expect(message).toMatch('attempt to retrieve a dependency failed:');
  });

  test('$("FakeValidator") should return a mocked validator instance', () => {
    const FakeValidator = $('FakeValidator');
    expect(FakeValidator).toBe('Validator called by dependencyManager');
  });

  test('$("FakeExisting") should return an "existing" mocked mongoose model', () => {
    const FakeModel = $('FakeExisting');
    expect(FakeModel).toBe('The Fake model is returned');
  });

  test('$("Fake") returns a "new" mocked mongoose model', () => {
    const FakeModel = $('Fake');
    expect(FakeModel).toHaveProperty('type');
    expect(FakeModel).toHaveProperty('modInst');
    expect(FakeModel.type).toBe('Fake');
    expect(FakeModel.modInst).toBe('Model called by dependencyManager');
  });

  test('$(123) throws an exception because it is an unsupported data type', () => {
    var message = '';
    try {
      $(123);
    } catch (e) {
      message = e.message
    }
    expect(() => { $(123) }).toThrow();
    expect(message).toMatch('dependency expects strings, but got: number');
  });

  test ('$("duffValue") throws an exception because it is an unsupported format', () => {
    var message = '';
    try {
      $('duff_format');
    } catch (e) {
      message = e.message
    }
    expect(() => { $('duff_Format') }).toThrow();
    expect(message).toMatch('unsupported dependency format: duff_format');
  });

});
