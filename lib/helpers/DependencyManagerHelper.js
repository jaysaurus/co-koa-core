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
      factoryOverride: `${libDir}/i18n/${conf.corei18n}.depManMessages.json`,
      logger: conf.logger });
    const enumsDir = require(`${conf.root}/api/Enums.js`);
    const assetFactory = AssetFactory(conf, echo);

    this.conf = conf;
    this.echo = echo;

    this.appendConfigToCallerMethod = function () {
      if (!parent.call.environment) {
        this.conf.env.mongoDB_URI = undefined; // safely remove connection string
        Object.assign(parent.call, this.conf);
      }
    };

    this.fetchFile = function (type, itemName) {
      switch (type) {
        case 'Service':
          const service = this.getter(type, itemName);
          return this.parseInstance(service, type, itemName);
        case 'Validator':
          const validator = this.getter('Model', `validators/${itemName}`);
          return this.parseInstance(validator, type, itemName);
        default:
          if (this.conf.useMongoose) {
            return mongoose.models[itemName];
          } else {
            const validator = this.getter('Model', itemName);
            return this.parseInstance(validator, type, itemName);
          }
      }
    };

    this.fetchToken = function (type) {
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
    };

    this.getter = function (type, item) {
      try {
        return require(`${this.conf.root}/api/${type.toLowerCase()}s/${item}`);
      } catch (e) { this.echo.throw('failed', item); }
    };

    this.parseInstance = function (instance, type, itemName) {
      return (typeof instance === 'function')
        ? instance(parent.call)
        : this.echo.throw('invalidDependencyFile', type, itemName);
    };
  }
});

module.exports = (conf, libDir, parent) => DependencyManagerHelper({ conf, libDir, parent });
