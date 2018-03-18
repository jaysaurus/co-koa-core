'use strict';

const stampit = require('stampit');

const DependencyManagerHelper = require('./helpers/DependencyManagerHelper.js');

module.exports = stampit({
  init ({ conf, app }) {
    const helper = DependencyManagerHelper({ conf, libDir: __dirname, parent: this, app });

    this.call = function (item) {
      try {
        if (typeof item === 'string') {
          if (item.match(/^:/)) return helper.fetchToken(item);
          else {
            let type = item.match(/[A-Z]{1}[a-z]+$/);
            if (type && type.length) return helper.fetchFile(type[0], item.replace('.', '/'));
            else helper.echo.throw('unsupported', item);
          }
        } else helper.echo.throw('invalidType', typeof item);
      } catch (e) { helper.echo.throw('invalidDependency', e.message, e); }
    };

    // hoist Object assignment, then append configuration object to the call method.
    Object.assign(this.call, conf);
  }
});
