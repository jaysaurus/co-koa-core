'use strict';

const echoHandler = require('echo-handler');
const stampit = require('stampit');

const AssetFactory = require('./resources/AssetFactory.js');
const AsyncLibrary = require('./resources/AsyncLibrary.js');
const Builder = require('../Builder');
const TreeAlgorithm = require('./resources/TreeAlgorithm.js');

module.exports = stampit({
  props: {
    conf: null,
    echo: null
  },
  init ({ conf, libDir, parent, app }) {
    const echo = echoHandler.configure({
      factoryOverride: `${libDir}/i18n/${conf.corei18n}.depManMessages.json`,
      logger: conf.logger });
    const enumsDir = require(`${conf.root}/api/Enums.js`);
    const assetFactory = AssetFactory(conf, echo);

    this.conf = conf;
    this.echo = echo;

    function dependencyGetter (type, itemName) {
      if (this.conf.dependencyRegister) {
        const dependency = Object.keys(this.conf.dependencyRegister).find(itemType => { return itemType === type; });
        if (dependency) {
          try {
            const instance = require(`${this.conf.root}/api/${this.conf.dependencyRegister[dependency]}/${itemName}`);
            return (typeof instance === 'function') ? (instance(parent.call) || true) : instance;
          } catch (e) { this.echo.throw('failed', itemName); }
        } else return undefined;
      }
    }

    function modelGetter (type, itemName) {
      const defaultModel =
        this.parseInstance(
          this.getter('Model', itemName), type, itemName);
      try {
        if (app && typeof defaultModel._modelType !== 'undefined') {
          const model = app._modelRegister[defaultModel._modelType](itemName);
          if (model) return model;
        }
      } catch (e) {
        this.echo.error('invalidModelDefinition', e.message);
      }
      return defaultModel;
    }

    this.fetchFile = function (type, itemName) {
      switch (type) {
        case 'Service':
          const service = this.getter(type, itemName);
          return this.parseInstance(service, type, itemName);
        case 'Validator':
          const validator = this.getter('Model', `validators/${itemName}`);
          return this.parseInstance(validator, type, itemName);
        default:
          return dependencyGetter.call(this, type, itemName) || modelGetter.call(this, type, itemName);
      }
    };

    this.fetchToken = function (type) {
      switch (type) {
        case ':async':
          return AsyncLibrary();
        case ':builder':
          return Builder(conf);
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
