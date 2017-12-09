const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');

module.exports = function CoKoaMVC (root, environment) {
  const Builder = require('./lib/Builder');
  const ClientConfigFactory = require('./lib/ClientConfigFactory');
  const DependencyManager = require('./lib/DependencyManager');
  const middleware = require(`${root}/config/middleware`);
  const ModelFactory = require('./lib/ModelFactory');
  const WelcomeMessage = require('./lib/WelcomeMessage');

  const conf = ClientConfigFactory(root).build(environment);

  this.launch = () => {
    const app = new Koa().use(BodyParser());
    const router = new Router();

    WelcomeMessage(conf).sayHello();
    const $ = DependencyManager(conf);

    /*
    * SETUP MODELS
    */
    ModelFactory(conf).build($.call);

    /*
    * SETUP VIEWS (OPTIONAL)
    */
    if (conf.useHBS) {
      const hbsOptions = require(`${root}/config/hbsConfig`);
      const renderer = require('koa-hbs-renderer');
      app.use(renderer(hbsOptions(conf)));
    }

    /*
    * SETUP MIDDLEWARE
    */
    const wares = Object.assign({}, middleware($.call));
    Object.keys(wares).forEach(key => { app.use(wares[key]); });

    /*
    * BUILD CONTROLLERS
    */
    Builder(conf)
      .build('Controller', (controller, prefix) => {
        const routes = controller($.call);
        Object.keys(routes)
          .forEach(
            (route) => {
              var routeArray = route.split(' ');
              try {
                if (routeArray.length === 2) {
                  router[routeArray[0].toLowerCase()](
                    '/' + prefix + routeArray[1], routes[route]);
                } else throw new Error();
              } catch (e) {
                conf.logger.error(`failed to generate action "${route}": is your verb valid?'}`);
              }
            });
      });

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
};
