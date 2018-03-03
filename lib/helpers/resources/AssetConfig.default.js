'use strict';

module.exports = ['development', 'test', 'production'].reduce(
  (obj, environment) => {
    switch (environment) {
      case 'development':
      case 'test':
        obj[environment] = {
          'css': '/src/assets/css',
          'html': '/',
          'img': '/src/assets/img',
          'js': '/src/assets/js'
        };
        break;
      case 'production':
        obj[environment] = {
          'css': '/static/css',
          'html': '/',
          'img': '/static/img',
          'js': '/static/js'
        };
    }
    return obj;
  }, {});
