const Builder = require('./Builder');
const echoHandler = require('echo-handler');
const stampit = require('stampit');

const ControllerFactory = stampit({
  init (conf) {
    const echo = echoHandler.configure({
      factoryOverride: `${__dirname}/i18n/${conf.corei18n}.controllerMessages.json`,
      logger: conf.logger });

    this.build = function (router, $) {
      Builder(conf)
        .build('Controller', (controller, prefix) => {
          const routes = controller($.call);
          Object.keys(routes)
            .forEach(
              (route) => {
                var routeArray = route.split(' ');
                try {
                  if (routeArray.length === 2) {
                    const parsedPrefix =
                      (prefix.toLowerCase() === 'index') ? '' : `/${prefix}`;
                    for (let verb of routeArray[0].trim().split(',')) {
                      router[verb.toLowerCase()](
                        parsedPrefix + routeArray[1],
                        routes[route]);
                    }
                  } else echo.throw('badVerb', route);
                } catch (e) {
                  echo.error('failed', e.message);
                }
              });
        });
    };
  }
});

module.exports = conf => ControllerFactory(conf);
