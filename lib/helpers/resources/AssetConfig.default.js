'use strict';

module.exports = ['development', 'test', 'production'].reduce(
  (obj, environment) => {
    switch (environment) {
      case 'development':
      case 'test':
        obj[environment] = {
          'css': 'src/assets/css',
          'html': '/',
          'img': 'src/assets/img',
          'js': 'src/assets/js'
        };
        break;
      case 'production':
        obj[environment] = {
          'css': 'dist/static/css',
          'html': 'dist/html',
          'img': 'dist/static/img',
          'js': 'dist/static/js'
        };
    }
    return obj;
  }, {});
