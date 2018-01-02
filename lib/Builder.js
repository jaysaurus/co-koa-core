'use strict';

const BuilderHelper = require('./helpers/BuilderHelper.js');
const echoHandler = require('echo-handler');
const fs = require('fs');
const stampit = require('stampit');

const Builder = stampit({
  init (conf) {
    const echo =
      echoHandler.configure({
        factoryOverride: `${__dirname}/i18n/${conf.corei18n}.buildMessages.json`,
        logger: conf.logger });

    const helper = BuilderHelper(conf, echo);

    Object.assign(this, {
      build (type, clientCallback) {
        try {
          const dirName = `${type.toLowerCase()}s`;
          const dir = `${conf.root}/api/${dirName}/`;
          if (!fs.existsSync(dir)) {
            echo.throw('invalidDirectory', dirName);
          } else {
            helper.appendFileCommands(
              fs.readdirSync(dir).reduce(helper.reduceToFiles, []),
              type,
              clientCallback);
            echo.log('success', type);
          }
        } catch (e) {
          echo.throw('buildFailed', type, e.stack);
        }
        return clientCallback;
      }
    });
  }
});

module.exports = conf => Builder(conf);
