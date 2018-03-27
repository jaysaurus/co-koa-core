'use strict';

const echoHandler = require('echo-handler');
const libDirectory = __dirname.replace('/helpers', '');
const stampit = require('stampit');

const ClientConfigFactoryHelper = stampit({
  init (root) {
    const config = require(`${root}/config/config.json`);

    const supportedLanguages = require('./supportedLanguages.json');
    const i = supportedLanguages.indexOf(config.defaultLanguage);
    const corei18n = (i > -1)
      ? supportedLanguages[i]
      : 'en';

    const confMessagesUri = `${libDirectory}/i18n/${corei18n}.confManMessages.json`;

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
      getCorei18n () {
        return corei18n;
      },
      getDependencyRegister () {
        return (typeof config.dependencyRegister === 'object')
          ? config.dependencyRegister
          : {};
      },
      getEnvConfig (env, echo) {
        return config['environment'][env];
      }
    },
    require(`${libDirectory}/i18n/${corei18n}.confManMessages.json`),
    { logger }, config);
  }
});

module.exports = root => ClientConfigFactoryHelper(root);
