'use strict';

const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const stampit = require('stampit');
const yargs = require('yargs');
const {argv} =
  yargs.options({
    environment: {
      alias: 'e',
      describe: 'choose the environment to run, defaults to "development"',
      string: true
    }
  })
  .help()
  .alias('help', 'h');

const BuiltInMiddleware = require('./lib/BuiltInMiddleware');
const ControllerFactory = require('./lib/ControllerFactory');
const ClientConfigFactory = require('./lib/ClientConfigFactory');
const DependencyManager = require('./lib/DependencyManager');
const ModelFactory = require('./lib/ModelFactory');
const PluginManager = require('./lib/PluginManager');
const WelcomeMessage = require('./lib/WelcomeMessage');

module.exports = stampit({
  init (root) {
    const environment = argv['environment'] || 'development';
    const middleware = require(`${root}/config/middleware`);
    const conf = ClientConfigFactory(root).build(environment);

    this.launch = function (...plugins) {
      const app = new Koa().use(BodyParser());
      const router = new Router();
      WelcomeMessage(conf).sayHello();
      const $ = DependencyManager(conf);

      /*
      * SETUP MODELS
      */
      ModelFactory(conf).build($.call);

      /*
      * PLUGINS
      */
      if (plugins.length) {
        PluginManager(conf).init(app, $.call, ...plugins);
      }
      /*
      * SETUP MIDDLEWARE
      */
      BuiltInMiddleware(app, conf).build();
      const wares = { ...middleware($.call) };
      Object.keys(wares).forEach(key => { app.use(wares[key]); });

      /*
      * BUILD CONTROLLERS
      */
      ControllerFactory(conf).build(router, $);

      /*
      * BOOTSTRAP
      */
      require(`${root}/config/bootstrap`).bootstrap($.call);

      conf.logger.log(`listening on port ${conf.env.port}`);
      return {
        app,
        port: conf.env.port,
        router
      };
    };
  }
});
