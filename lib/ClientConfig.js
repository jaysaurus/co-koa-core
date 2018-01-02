'use strict';

const stampit = require('stampit');

const ClientConfig = stampit({
  props: {
    appKeys: null,
    corei18n: null,
    env: null,
    environment: null,
    i18n: null,
    logger: null,
    messageFolder: null,
    optionalModules: null,
    root: null,
    useHBS: null
  },
  init ({
    appKeys = this.appKeys,
    corei18n = this.corei18n,
    env = this.env,
    environment = this.environment,
    logger = this.logger,
    i18n = this.i18n,
    messageFolder = this.messageFolder,
    optionalModules = this.optionalModules,
    root = this.root }) {
    this.appKeys = appKeys;
    this.corei18n = corei18n;
    this.env = env;
    this.environment = environment;
    this.logger = logger;
    this.i18n = i18n;
    this.messageFolder = messageFolder;
    this.optionalModules = optionalModules;
    this.root = root;
  }
});

module.exports = ClientConfig;
