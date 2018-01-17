'use strict';

const fs = require('fs');
const stampit = require('stampit');

const WelcomeMessage = stampit({
  init (environment) {
    this.sayHello = function (out = console.log) {
      if (environment === 'development' || environment === 'test') {
        try {
          out(
            fs.readFileSync(`${__dirname}/welcomeMessage.txt`)
            .toString());
        } catch (e) {
          out('-- Welcome to Co.Koa --');
        }
      }
      out(`Server launched at: ${new Date()}`);
    };
  }
});

module.exports = conf => WelcomeMessage(conf.environment);
