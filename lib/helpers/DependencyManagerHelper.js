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
          Object.assign(parent.call, this.conf);
        }
      },

      fetchFile (type, itemName) {
        switch (type) {
          case 'Service':
            const service = this.getter(type, itemName);
            return this.parseInstance(service, type, itemName);
          case 'Validator':
            const validator = this.getter('Model', `validators/${itemName}`);
            return this.parseInstance(validator, type, itemName);
          default:
            return mongoose.models[itemName];
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

      getter (type, item) {
        try {
          return require(`${this.conf.root}/api/${type.toLowerCase()}s/${item}`);
        } catch (e) { this.echo.throw('failed', item); }
      },

      parseInstance (instance, type, itemName) {
        return (typeof instance === 'function')
          ? Object.assign({}, instance(parent.call))
          : this.echo.throw('invalidDependencyFile', type, itemName);
      }
    });
  }
});

module.exports = (conf, libDir, parent) => DependencyManagerHelper({ conf, libDir, parent });
