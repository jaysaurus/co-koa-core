const AsyncHandler = require('../.core/handlers/AsyncHandler');

describe('AsyncHandler integration tests', () => {
  const mockItem = {
    1: {name: 'A'},
    2: {name: 'B'}
  };

  function mockAsync(id) {
    return new Promise((resolve, reject) => {
      const mockId = typeof id === 'number' ? id : -1;
      process.nextTick(
        () => mockItem[mockId] ? resolve(mockItem[mockId]) : reject({
          error: 'Invalid ID',
        })
      );
    });
  }

  test('async operation .each()', async () => {
    const _async = new AsyncHandler();
    const output = [];
    await _async.each([1,2], async (i) => {
      let val = await mockAsync(i);
      output.push(val);
    });
    expect(output.length).toBe(2);
    expect(output[0].name).toBe('A');
    expect(output[1].name).toBe('B');
  });

  test('async operation .reduce()', async () => {
    const _async = new AsyncHandler();
    let output = await _async.reduce([1,2], async (out, i) => {
      let val = await mockAsync(i);
      out.push(val);
      return out;
    }, []);
    expect(output.length).toBe(2);
    expect(output[0].name).toBe('A');
    expect(output[1].name).toBe('B');
  });
});
