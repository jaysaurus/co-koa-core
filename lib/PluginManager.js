const stampit = require('stampit');
const echoHandler = require('echo-handler');

module.exports = stampit({
  init (conf) {
    const echo = echoHandler.configure({
      factoryOverride: `${__dirname}/i18n/${conf.corei18n}.pluginManMessages.json`,
      logger: conf.logger });

    Object.assign(this, {
      init (app, $, ...plugins) {
        const result =
          plugins.reduce((count, plugin) => {
            try {
              if (typeof plugin === 'object') {
                if (typeof plugin.init === 'function') {
                  plugin.init(app, $);
                } else echo.throw({ name: 'InvalidPluginException', message: 'invalidPluginInit' });
              } else echo.throw({ name: 'InvalidPluginException', message: 'invalidPlugin' });
              return --count;
            } catch (e) {
              echo.error('failed', e.name, e.message);
              return count;
            }
          }, plugins.length);
        echo.log('success', plugins.length - result, plugins.length);
      }
    });
  }
});
