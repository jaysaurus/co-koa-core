process.env.NODE_ENV = 'test';
const __i18n = 'en'; // force i18n to be english for sake of tests.
const logSpy = []
const conf = {
  logger: { log: (msg) => {logSpy.push(msg)} },
  i18n: 'en',
  root: __dirname.replace('__tests__', '__mocks__')
}

// VIRTUALS
jest.mock(`${__dirname.replace('__tests__', '__mocks__')}/api/controllers/test1Controller.js`, () => {
  return "I am the 1st fake file";
}, {virtual: true});
jest.mock(`${__dirname.replace('__tests__', '__mocks__')}/api/controllers/test2Controller.js`, () => {
  return "I am the 2nd fake file";
}, {virtual: true});
jest.mock(`${__dirname.replace('__tests__', '__mocks__')}/api/controllers/notAControllerTest.js`, () => {
  return "I am not a controller";
}, {virtual: true});

jest.mock('fs');

describe('how build assigns closure actions to multiple files in a directory', () => {
  const MOCK_FILE_INFO = {
    [`${conf.root}/api/controllers/test1Controller.js`]: 1,
    [`${conf.root}/api/controllers/test2Controller.js`]: 2,
    [`${conf.root}/api/controllers/notAControllerTest.js`]: 3
  };
  const Builder = require('../lib/Builder.js');
  // Set up some mocked out file info before each test
  beforeEach(() => {
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  test('build method pulls in fake files from "fakes" directory and passes their contents to supplied closure', () => {
    let test = [];
    Builder(conf).build('Controller', (fake, objName) => {
      test.push(fake)
      test.push(objName);
    });
    console.log(logSpy);
    expect(test.length).toBe(4);
    expect(test[0]).toMatch('I am the 1st fake file');
    expect(test[1]).toBe('test1');
    expect(test[2]).toMatch('I am the 2nd fake file');
    expect(test[3]).toBe('test2');
    expect(logSpy.length).toBe(2);
    expect(logSpy[0]).toBe(`Spotted 'notAControllerTest.js' in '/controllers'. Build will not action this item.`)
  });

  test('build handles exceptions when directory does not exist', () => {
    require('fs').__setMockExistsSync(false);
    let message = '';
    try {
      Builder(conf).build('Controller', (fake, objName) => {
        test.push({fake, objName});
      });
    } catch (e) {
      message = e.message;
    }
    expect(message).toMatch(`directory 'controllers' doesn't exist`);
    expect(message).toMatch('Failed to build Controllers: Error: ');
  });
});
