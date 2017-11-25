const stampit = require('stampit');

const ClientConfig = stampit({
  props: {
    env: null,
    environment: null,
    i18n: null,
    logger: null,
    messageFolder: null,
    root: null,
    useHBS: null
  },
  init ({
    env = this.env,
    environment = this.environment,
    logger = this.logger,
    i18n = this.i18n,
    messageFolder = this.messageFolder,
    root = this.root,
    useHBS = this.root }) {
    this.env = env;
    this.environment = environment;
    this.logger = logger;
    this.i18n = i18n;
    this.messageFolder = messageFolder;
    this.root = root;
    this.useHBS = root;
  }
});

module.exports = ClientConfig;
