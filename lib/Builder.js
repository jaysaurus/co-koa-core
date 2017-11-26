'use strict';

const BuilderHelper = require('./helpers/BuilderHelper.js');
const echoHandler = require('echo-handler');
const fs = require('fs');

module.exports = function Builder (conf) {
  const echo =
    echoHandler.configure({
      factoryOverride: `${__dirname}/i18n/${conf.i18n}.buildMessages.json`,
      logger: conf.logger });

  const helper = BuilderHelper(conf, echo);

  this.build = (type, $) => {
    try {
      const dirName = `${type.toLowerCase()}s`;
      const dir = `${conf.root}/api/${dirName}/`;

      if (!fs.existsSync(dir)) {
        echo.throw('invalidDirectory', dirName);
      } else {
        helper.appendFileCommands(
          fs.readdirSync(dir).reduce(helper.reduceToFiles, []),
          type,
          $);
        echo.log('success', type.match(/[A-Za-z0-9]+$/));
      }
    } catch (e) {
      echo.throw('buildFailed', type, e.stack);
    }
    return $;
  };
};
