const fs = require('fs');
const root = __dirname.replace('/__tests__', '');
const welcomeMessage = require('../lib/WelcomeMessage.js');

jest.mock('fs');

describe('WelcomeMessage tests', () => {
  test(
    'sayHello renders WelcomeMessage.text if environment is development', () => {
      let expected = `test: Server launched at: ${new Date()}`
      let observer = '';
      console.log()
      welcomeMessage({ environment: 'development' }).sayHello((str) => { observer += str });
      expect(observer).toBe(expected);
    });
  test(
    'sayHello renders WelcomeMessage.text if environment is test', () => {
      let expected = `test: Server launched at: ${new Date()}`
      let observer = '';
      welcomeMessage({ environment: 'test' }).sayHello((str) => { observer += str });
      expect(observer).toBe(expected);
    });
  test(
    'sayHello throws a short message rather than read from a file', () => {
      require('fs').__setReadFileSyncToThrow(true);
      let observer = '';
      welcomeMessage({ environment: 'test' }).sayHello((str) => { observer += str });
      expect(observer).toBe(`-- Welcome to Co.Koa --Server launched at: ${new Date()}`);
    });
  test(
    'sayHello is neither dev nor test', () => {
      let expected = `Server launched at: ${new Date()}`
      let observer = '';
      welcomeMessage({ }).sayHello((str) => { observer += str });
      expect(observer).toBe(expected);
    });
  test(
    'sayHello uses console.log by default', () => {
      let expected = `Server launched at: ${new Date()}`
      let observer = '';
      console.log = (val) => { observer = val; }
      welcomeMessage({ }).sayHello();
      expect(observer).toBe(expected);
    });
});
