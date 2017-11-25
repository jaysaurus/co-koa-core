'use strict';

const fs = require('fs');

const WelcomeMessage = {
  sayHello: function (out = console.log) {
    if (this.environment === 'development' || this.environment === 'test') {
      try {
        out(
          fs.readFileSync(`${__dirname}/welcomeMessage.txt`)
            .toString());
      } catch (e) {
        out('-- Welcome to Co.Koa --');
      }
    }
    out(`Server launched at: ${new Date()}`);
  }
};

module.exports = (conf) => {
  return Object.assign({}, WelcomeMessage, conf);
};
