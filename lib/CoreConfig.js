const stampit = require('stampit');

const CoreConfig = stampit({
  init (root) {
    const CoreConfigHelper = require('./CoreConfigHelper.js');
    const ClientConfig = require('./ClientConfig.js');
    const helper = CoreConfigHelper(root);

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

module.exports = root => CoreConfig(root);

// module.exports = function ConfigManager (root) {
//   const config = require(`${root}/config/config.json`);
//   const envConfig = require(`${root}/config/envConfig`);
//   const confMessages = require(`${__dirname}/i18n/${config.defaultLanguage}.confManMessages.json`);
//   const logger = require(`${root}/config/Logger.js`);
//
//   const getEchoObject = (env) => {
//     try {
//       const echo =
//         echoHandler.configure({
//           factoryOverride: `${__dirname}/i18n/${config.defaultLanguage}.confManMessages.json`,
//           logger: logger(env) });
//       return echo;
//     } catch (e) { return undefined; }
//   };
//
//   const getEnvConfig = (env, echo) => {
//     const ec = envConfig(env, config['environment'][env], mongoose);
//     if (ec) return ec;
//     else echo.throw('invalidEnv');
//   };
//
//   this.build = function (env, spy) {
//     const echo = getEchoObject(env);
//     if (typeof echo === 'object') {
//       try {
//         return {
//           env: getEnvConfig(env, echo),
//           environment: env,
//           i18n: config['defaultLanguage'],
//           logger: logger(env, spy),
//           messageFolder: config['messageFolder'].replace(/^\.*/, root),
//           root,
//           useHBS: config['useHBS']
//         };
//       } catch (e) {
//         echo.throw('failed', e.message);
//       }
//     } else {
//       throw new Error(
//         (confMessages && confMessages.fatalError)
//           ? confMessages.fatalError
//           : 'FATAL: Something went fatally wrong, ConfigManager could not find it\'s messages AND config.json was not understood. Your Co.Koa installation may have become corrupted.');
//     }
//   };
// };
