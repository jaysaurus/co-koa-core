'use strict';

const stampit = require('stampit');

const DependencyManagerHelper = require('./helpers/DependencyManagerHelper.js');

const DependencyManager = stampit({
  init (conf) {
    const helper = DependencyManagerHelper(conf, __dirname, this);

    Object.assign(this, {
      call (item) {
        try {
          helper.appendConfigToCallerMethod();
          if (typeof item === 'string') {
            if (item.match(/^:/)) return helper.fetchToken(item);
            else {
              let type = item.match(/[A-Z]{1}[a-z]+$/);
              if (type && type.length) return helper.fetchFile(type[0], item.replace('.', '/'));
              else helper.echo.throw('unsupported', item);
            }
          } else helper.echo.throw('invalidType', typeof item);
        } catch (e) { helper.echo.throw('invalidDependency', e.message, e); }
      }
    });
  }
});

module.exports = conf => DependencyManager(conf);
