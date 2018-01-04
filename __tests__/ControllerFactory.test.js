jest.mock('../lib/Builder');

const ControllerFactory = require('../lib/ControllerFactory');

describe('ControllerFactory test', () => {
  const errorSpy = [];
  const conf = {
    spy: [],
    corei18n: 'en',
    logger: {
      error (message) {
        errorSpy.push(message);
      }
    }
  };
  const $ = {
    call: 'Dependency Manager Call Pointer'
  };

  const routerSpy = [];
  const mockRouter = { get (route) { routerSpy.push(route); } }

  ControllerFactory(conf).build(mockRouter, $);

  test('a router is supplied to the build method', () => {
    expect(conf.spy.length).toBe(1);
    expect(typeof conf.spy[0]['Controller']).toBe('function');
  });

  test('a controller is legitimately assigned to router', () => {
    const controllerSpy = [];
    conf.spy[0]['Controller'](
      (dependencyManager) => {
        controllerSpy.push(dependencyManager);
        return { 'GET /someAction': 'someAction method' };
      }, 'valid');

    expect(controllerSpy[0]).toBe('Dependency Manager Call Pointer');
    expect(routerSpy.length).toBe(1);
    expect(routerSpy[0]).toBe('/valid/someAction');
  });

  test('index controller is assigned without prefix', () => {
    const controllerSpy = [];
    conf.spy[0]['Controller'](
      (dependencyManager) => {
        controllerSpy.push(dependencyManager);
        return { 'GET /someAction': 'someAction method' };
      }, 'Index');

    expect(routerSpy.length).toBe(2);
    expect(routerSpy[1]).toBe('/someAction');
  });

  test('a controller has an invalid action', () => {
    const controllerSpy = [];
    conf.spy[0]['Controller'](
      (dependencyManager) => {
        controllerSpy.push(dependencyManager);
        return { 'GET/someAction': 'someAction method' };
      }, 'invalid');

    expect(errorSpy.length).toBe(2);
    expect(errorSpy[0]).toBe('failed');
    expect(errorSpy[1]).toBe('badVerb: GET/someAction');
  });
})
