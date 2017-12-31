'use strict';

module.exports = ['development', 'test', 'production'].reduce(
  (obj, environment) => {
    switch (environment) {
      case 'development':
      case 'test':
        obj[environment] = {
          'css': '/css',
          'html': '/html',
          'img': '/images',
          'js': '/js'
        };
        break;
      case 'production':
        obj[environment] = {
          'css': '/.min/css',
          'html': '/html',
          'img': '/images',
          'js': '/.min/js'
        };
    }
    return obj;
  }, {});
