'use strict';

const stampit = require('stampit');

const ClientConfigFactoryHelper = require('./helpers/ClientConfigFactoryHelper.js');

const ClientConfigFactory = stampit({
  init (root) {
    const ClientConfig = require('./ClientConfig.js');
    const helper = ClientConfigFactoryHelper(root);

    this.build = function (env, spy) {
      const echo = helper.getEchoObject(env);
      if (typeof echo === 'object') {
        try {
          if (typeof helper.getCorei18n === 'function') {
            return ClientConfig({
              appKeys: helper.appKeys,
              corei18n: helper.getCorei18n(),
              dependencyRegister: helper.getDependencyRegister(),
              env: helper.getEnvConfig(env, echo),
              environment: env,
              i18n: helper.defaultLanguage,
              logger: helper.logger(env, spy),
              messageFolder: helper.messageFolder.replace(/^\.*/, root),
              optionalModules: helper.optionalModules,
              root
            });
          } else throw new Error('Invalid ClientConfigHelper detected');
        } catch (e) {
          echo.throw('failed', e.message);
        }
      } else {
        throw new Error(
          (helper.fatalError)
            ? helper.fatalError
            : 'FATAL: Something went fatally wrong, ConfigManager could not find it\'s messages AND config.json was not understood. Your Co.Koa installation may have become corrupted.');
      }
    };
  }
});

module.exports = root => ClientConfigFactory(root);
