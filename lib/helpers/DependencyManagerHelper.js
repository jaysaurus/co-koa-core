'use strict';

const echoHandler = require('echo-handler');
const mongoose = require('mongoose');
const stampit = require('stampit');

const AssetFactory = require('./resources/AssetFactory.js');
const AsyncLibrary = require('./resources/AsyncLibrary.js');
const TreeAlgorithm = require('./resources/TreeAlgorithm.js');

const DependencyManagerHelper = stampit({
  props: {
    conf: null,
    echo: null
  },
  init ({ conf = this.conf, libDir, parent }) {
    const echo = echoHandler.configure({
      factoryOverride: `${libDir}/i18n/${conf.i18n}.depManMessages.json`,
      logger: conf.logger });
    const enumsDir = require(`${conf.root}/api/Enums.js`);
    const assetFactory = AssetFactory(conf, echo);

    this.conf = conf;
    this.echo = echo;

    Object.assign(this, {
      appendConfigToCallerMethod () {
        if (!parent.call.environment) {
          delete this.conf.env.mongoDB_URI; // safely remove connection string
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
          case ':tree':
            return TreeAlgorithm;
          default:
            return assetFactory.build(type);
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
