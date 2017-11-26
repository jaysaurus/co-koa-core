const __root = __dirname.replace('/__tests__','__mocks__');
process.env.NODE_ENV = 'test';
ConfigManager = require(`../lib/ConfigManager`);
const __i18n = 'en'; // force i18n to be english for sake of tests.
const logSpy = []
const conf = new ConfigManager(__dirname.replace('/__tests__','__mocks__')).build('test', logSpy);
// VIRTUALS
jest.mock(`${__dirname.replace('/__tests__','__mocks__')}/api/controllers/test1Controller`, () => {
  return "I am the 1st fake file";
}, {virtual: true});
jest.mock(`${__dirname.replace('/__tests__','__mocks__')}/api/controllers/test2Controller`, () => {
  return "I am the 2nd fake file";
}, {virtual: true});
jest.mock(`${__dirname.replace('/__tests__','__mocks__')}/api/controllers/notAControllerTest`, () => {
  return "I am not a controller";
}, {virtual: true});

jest.mock('fs');

describe('how build assigns closure actions to multiple files in a directory', () => {
  const MOCK_FILE_INFO = {
    [`${__root}/api/controllers/test1Controller`]: 1,
    [`${__root}/api/controllers/test2Controller`]: 2,
    [`${__root}/api/controllers/notAControllerTest`]: 3
  };
  const Builder = require('../.core/Builder');
  // Set up some mocked out file info before each test
  beforeEach(() => {
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  test('build method pulls in fake files from "fakes" directory and passes their contents to supplied closure', () => {
    let test = [];
    new Builder(conf).build('Controller', (fake, objName) => {
      test.push({fake, objName});
    });
    expect(test.length).toBe(2);
    expect(test[0].fake).toMatch('1st');
    expect(test[0].objName).toBe('test1');
    expect(test[1].fake).toMatch('2nd');
    expect(test[1].objName).toBe('test2');
    expect(logSpy.length).toBe(2);
    expect(logSpy[0]).toBe(`Spotted 'notAControllerTest' in '/controllers'. Build will not action this item.`)
  });

  test('build method pulls in fake files from "fakes" directory and passes their contents to supplied closure', () => {
    require('fs').__setMockExistsSync(false);
    let message = '';
    try {
      new Builder(conf).build('Controller', (fake, objName) => {
        test.push({fake, objName});
      });
    } catch (e) {
      message = e.message;
    }
    expect(message).toMatch(`directory 'controllers' doesn't exist`);
    expect(message).toMatch('Failed to build Controllers: Error: ');
  });
});
