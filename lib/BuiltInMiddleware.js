const stampit = require('stampit');
const echoHandler = require('echo-handler');

const locale = require('koa-locale');
const renderer = require('koa-hbs-renderer');
const serve = require('koa-static');

const BuiltInMiddleware = stampit({
  init ({ app, conf }) {
    const echo = echoHandler.configure({
      factoryOverride: `${__dirname}/i18n/${conf.corei18n}.builtInMiddleware.json`,
      logger: conf.logger
    });

    function initialiseMandatoryComponents () {
      if (!app.keys) {
        app.keys = conf.appKeys && conf.appKeys.length
        ? conf.appKeys : [Math.floor((Math.random() * Date.now()) + 1).toString()];
      }
      app.use(serve('public')); // serve the public folder
    }

    this.build = function () {
      initialiseMandatoryComponents();
      if (conf.optionalModules) {
        Object.keys(conf.optionalModules).forEach((key) => {
          if (conf.optionalModules[key]) {
            try {
              switch (key) {
                case 'koa-hbs-renderer':
                  const hbsConfig = require(`${conf.root}/config/hbsConfig.js`);
                  app.use(renderer(hbsConfig(conf)));
                  break;
                case 'koa-locale':
                  locale(app, 'language');
                  break;
              }
            } catch (e) {
              echo.error('fail', key, e.message);
            }
          }
        });
      }
      echo.log('success');
    };
  }
});

module.exports = (app, conf) => BuiltInMiddleware({ app, conf });
