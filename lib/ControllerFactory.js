const Builder = require('./Builder');
const stampit = require('stampit');

const ControllerFactory = stampit({
  init (conf) {
    Object.assign(this, {
      build (router, $) {
        Builder(conf)
          .build('Controller', (controller, prefix) => {
            const routes = controller($.call);
            Object.keys(routes)
              .forEach(
                (route) => {
                  var routeArray = route.split(' ');
                  try {
                    if (routeArray.length === 2) {
                      const parsedPrefix = (prefix.toLowerCase() === 'index') ? '' : `/${prefix}`;
                      router[routeArray[0].toLowerCase()](
                        parsedPrefix + routeArray[1], routes[route]);
                    } else throw new Error();
                  } catch (e) {
                    conf.logger.error(`failed to generate action "${route}": is your verb valid?'`);
                  }
                });
          });
      }
    });
  }
});

module.exports = conf => ControllerFactory(conf);
