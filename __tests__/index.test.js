/*#--runInBand --coverage && cat ./coverage/lcov.info | coveralls*/
jest.mock('koa');
jest.mock('koa-bodyparser');
jest.mock('koa-router');
jest.mock('yargs');

jest.mock('../lib/BuiltInMiddleware');
jest.mock('../lib/ControllerFactory');
jest.mock('../lib/ClientConfigFactory');
jest.mock('../lib/DependencyManager');
jest.mock('../lib/ModelFactory');
jest.mock('../lib/WelcomeMessage');

jest.mock('../__mocks__/config/middleware');
jest.mock('../__mocks__/config/bootstrap');

const Koa = require('../__mocks__/koa');
const BodyParser = require('../__mocks__/koa-bodyparser');
const Router = require('../__mocks__/koa-router');
// const yargs = require('../__mocks__/yargs');

const BuiltInMiddleware = require('../lib/__mocks__/BuiltInMiddleware');
const ClientConfigFactory = require('../lib/__mocks__/ClientConfigFactory.js');
const ControllerFactory = require('../lib/__mocks__/ControllerFactory');
const DependencyManager = require('../lib/__mocks__/DependencyManager');
const ModelFactory = require('../lib/__mocks__/ModelFactory');
const WelcomeMessage = require('../lib/__mocks__/WelcomeMessage');

const middleware = require('../__mocks__/config/middleware');
const bootstrap = require('../__mocks__/config/bootstrap');

const CoKoa = require('../index.js')
const fakeRoot = __dirname.replace('__tests__','__mocks__')
describe('index tests', () => {
  test('expect clientConfigFactory to have been called', () => {
    result = CoKoa(fakeRoot).launch();
    console.log(result)
    const spy = result.port;
    expect(spy.length).toBe(2);
    expect(spy[0]).toBe(fakeRoot);
    expect(spy[1]).toBe('test');
  });
});
