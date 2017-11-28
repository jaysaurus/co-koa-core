const ClientConfigFactoryHelper = require('./helpers/ClientConfigFactoryHelper.js');
const stampit = require('stampit');

const ClientConfigFactory = stampit({
  init (root) {
    const ClientConfig = require('./ClientConfig.js');
    const helper = ClientConfigFactoryHelper(root);

    Object.assign(this, {
      build (env, spy) {
        const echo = helper.getEchoObject(env);
        if (typeof echo === 'object') {
          try {
            return ClientConfig({
              env: helper.getEnvConfig(env, echo),
              environment: env,
              i18n: helper.defaultLanguage,
              logger: helper.logger(env, spy),
              messageFolder: helper.messageFolder.replace(/^\.*/, root),
              root,
              useHBS: helper.useHBS
            });
          } catch (e) {
            echo.throw('failed', e.message);
          }
        } else {
          throw new Error(
            (helper.fatalError)
              ? helper.fatalError
              : 'FATAL: Something went fatally wrong, ConfigManager could not find it\'s messages AND config.json was not understood. Your Co.Koa installation may have become corrupted.');
        }
      }
    });
  }
});

module.exports = root => ClientConfigFactory(root);
