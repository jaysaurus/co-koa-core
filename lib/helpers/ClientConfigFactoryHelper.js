'use strict';

const echoHandler = require('echo-handler');
const libDirectory = __dirname.replace('/helpers', '');
const mongoose = require('mongoose');
const stampit = require('stampit');

const ClientConfigFactoryHelper = stampit({
  init (root) {
    const config = require(`${root}/config/config.json`);
    const confMessagesUri = `${libDirectory}/i18n/${config.defaultLanguage}.confManMessages.json`;
    const envConfig = require(`${root}/config/envConfig.js`);

    const logger = (env, logSpy) => {
      const err = require(confMessagesUri);
      const logMeth = require(`${root}/config/logger.js`);
      if (env) {
        const errorMessage = err['loggerBadEnv'].replace('{0}', env);
        return logMeth(env, () => { throw new Error(errorMessage); });
      } else throw new Error(err['systemLoggerFailed']);
    };

    Object.assign(this, {
      getEchoObject (env) {
        return echoHandler.configure({
          factoryOverride: confMessagesUri,
          logger: logger(env) });
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
