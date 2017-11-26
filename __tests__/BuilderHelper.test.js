const BuilderHelper = require('../lib/helpers/BuilderHelper.js');

describe('BuilderHelper tests', () => {
  const spy = [];
  const builderHelper = BuilderHelper(
    { root: '../../__mocks__', },
    { log () {
        Object.keys(arguments).forEach(key => {
          spy.push(arguments[key]);
        });
      }
    }
  );
  test('appendFileCommands iterates through file list performing callback on each', () => {
    const testFileObserver = [];
    builderHelper.appendFileCommands(
      ['TestFake'],
      'Fake',
      (file, objectName) => {
        testFileObserver.push(file);
        testFileObserver.push(objectName);
      });
    expect(testFileObserver.length).toBe(2);
    expect(testFileObserver[0]).toBe('TestFake file content');
    expect(testFileObserver[1]).toBe('Test');
  });
  test('appendFileCommands iterates through Model file list performing callback', () => {
    const testFileObserver = [];
    builderHelper.appendFileCommands(
      ['Fake'],
      'Model',
      (file, objectName) => {
        testFileObserver.push(file);
        testFileObserver.push(objectName);
      });
    expect(testFileObserver.length).toBe(2);
    expect(testFileObserver[0]).toBe('Fake model content');
    expect(testFileObserver[1]).toBe('Fake');
  });
  test('appendFileCommands invalidType spotted', () => {
    builderHelper.appendFileCommands(
      ['Fake'],
      'Invalid');
    expect(spy.length).toBe(3);
    expect(spy[0]).toBe('invalidType');
    expect(spy[1]).toBe('Fake');
    expect(spy[2]).toBe('invalids');
  });
  test('appendFileCommands no files', () => {
    const result = builderHelper.appendFileCommands();
    expect(result).toBeUndefined();
  })
  test('reduceTofileNames tests', () => {
    const success = builderHelper.reduceToFiles([], 'someFile.js');
    expect(success.length).toBe(1);
    expect(success[0]).toBe('someFile.js');
    const ignore = builderHelper.reduceToFiles([], 'item.txt');
    expect(ignore.length).toBe(0);
  });
});
