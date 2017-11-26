const echoHandler = require('echo-handler');
const mongoose = require('mongoose');
const stampit = require('stampit');

const AssetHandler = require('./resources/AssetHandler.js');
const AsyncLibrary = require('./resources/AsyncLibrary.js');

const DependencyManagerHelper = stampit({
  props: {
    conf: null,
    echo: null
  },
  init ({ conf = this.conf, libDir, parent }) {
    const enumsDir = require(`${conf.root}/api/Enums.js`);

    this.conf = conf;
    this.echo =
      echoHandler.configure({
        factoryOverride: `${libDir}/i18n/${conf.i18n}.depManMessages.json`,
        logger: conf.logger });

    Object.assign(this, {
      appendConfigToCallerMethod () {
        if (!parent.call.environment) {
          Object.keys(this.conf)
            .forEach((key) => {
              parent.call[key] = this.conf[key];
            });
        }
      },

      fetchFile (type, item) {
        switch (type) {
          case 'Service':
            return new (this.getter(type, item))(parent.call);
          case 'Validator':
            return this.getter('Model', `validators/${item}`)(parent.call);
          default:
            return mongoose.models[item];
        }
      },

      fetchToken (type) {
        switch (type) {
          case ':async':
            return AsyncLibrary();
          case ':echo':
            return echoHandler.configure(conf);
          case ':enums':
            return enumsDir;
          default:
            return AssetHandler(type, this.conf);
        }
      },

      getter (type, item, lang) {
        try {
          return require(`${this.conf.root}/api/${type.toLowerCase()}s/${item}`);
        } catch (e) { this.echo.throw('failed', item); }
      }
    });
  }
});

module.exports = (conf, libDir, parent) => DependencyManagerHelper({ conf, libDir, parent });
