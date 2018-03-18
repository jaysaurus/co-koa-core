/*#--runInBand --coverage && cat ./coverage/lcov.info | coveralls*/
jest.mock('koa');
jest.mock('koa-bodyparser');
jest.mock('koa-router');
jest.mock('yargs');

jest.mock('../lib/BuiltInMiddleware');
jest.mock('../lib/ControllerFactory');
jest.mock('../lib/ClientConfigFactory');
jest.mock('../lib/DependencyManager');
jest.mock('../lib/PluginManager');
jest.mock('../lib/WelcomeMessage');

const fakeRoot = __dirname.replace('__tests__','__mocks__')
const configCalled = false;

const CoKoa = require('../index.js')
describe('index tests', () => {
  test('when clientConfigFactory builds config', () => {
    const configSpy = [];
    require('../lib/ClientConfigFactory')().setSpy(configSpy);
    CoKoa(fakeRoot);
    const spy = configSpy;
    expect(spy.length).toBe(1);
    expect(spy[0]).toBe('test');
  });

  test('when Koa is instantiated', () => {
    const Koa = require('koa');
    const koaSpy = [];
    var koa = new Koa().setObserver(koaSpy);
    CoKoa(fakeRoot).launch();
    const spy = new Koa().getObserver();
    expect(spy[0]).toBe('bodyParseCalled');
  });

  test('when the router object is instantiated', () => {
    const Router = require('koa-router');
    const router = new Router();
    CoKoa(fakeRoot).launch();
    expect(router.getCalled()).toBe(true);
  });

  test('when the welcomeMessage says hello', () => {
    const WelcomeMessage = require('../lib/WelcomeMessage');
    CoKoa(fakeRoot).launch();
    expect(WelcomeMessage().saidHello()).toBe(true);
  });

  test('when mock plugins are supplied to the PluginManager', () => {
    const pluginManager = require('../lib/PluginManager');
    expect(pluginManager().wasCalled()).toBe(false);

    CoKoa(fakeRoot).launch(1,2,3);
    expect(pluginManager().wasCalled()).toBe(true);
  });

  test('when middleware is supplied', () => {
    const Koa = require('koa');
    const koaSpy = [];
    var koa = new Koa().setObserver(koaSpy);
    CoKoa(fakeRoot).launch();
    const spy = new Koa().getObserver();
    expect(spy[1]).toBe('MiddlewareCalled');
  });

  test('when the ControllerFactory is created it should be supplied the router and the DependencyManager call pointer', () => {
    const spy = [];
    const ControllerFactory = require('../lib/ControllerFactory');
    controllerFactory = ControllerFactory().setSpy(spy);
    CoKoa(fakeRoot).launch();
    expect(spy[0]['IAmARouter']).toBe(true);
    expect(spy[1]['call']).toBe('DependencyManagerCallPointer');
  });

  test('when the launch is returned, it should have the app, port and router', () => {
    const result = CoKoa(fakeRoot).launch();
    expect(result.app.IAmKoa).toBe(true);
    expect(result.port).toBe(3000)
    expect(result.router.IAmARouter).toBe(true);
  });

  test('when argv environment is cleared the default development should be used', () => {
    require('yargs').clearArgvEnvironment();
    const configSpy = [];
    require('../lib/ClientConfigFactory')().setSpy(configSpy);
    CoKoa(fakeRoot);
    const spy = configSpy;
    expect(spy[0]).toBe('development');
  });
});
