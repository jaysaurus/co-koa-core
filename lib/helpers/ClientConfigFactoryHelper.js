const echoHandler = require('echo-handler');
const libDirectory = __dirname.replace('/helpers', '');
const mongoose = require('mongoose');
const stampit = require('stampit');

const ClientConfigFactoryHelper = stampit({
  init (root) {
    const config = require(`${root}/config/config.json`);
    const confMessagesUri = `${libDirectory}/i18n/${config.defaultLanguage}.confManMessages.json`;
    const envConfig = require(`${root}/config/envConfig.js`);
    const logger = require(`${root}/config/Logger.js`);

    Object.assign(this, {
      getEchoObject (env) {
        try {
          return echoHandler.configure({
            factoryOverride: confMessagesUri,
            logger: logger(env) });
        } catch (e) { return undefined; }
      },
      getEnvConfig (env, echo) {
        const ec = envConfig(env, config['environment'][env], mongoose);
        if (ec) return ec;
        else echo.throw('invalidEnv');
      }
    },
    require(`${libDirectory}/i18n/${config.defaultLanguage}.confManMessages.json`),
    { logger }, config);
  }
});

module.exports = root => ClientConfigFactoryHelper(root);
