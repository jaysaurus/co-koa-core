module.exports = function TokenConfig () {
  return {
    development: {
      'css': '/public/css',
      'html': '/public/html',
      'img': '/public/images',
      'js': '/public/js'
    },
    test: {
      'css': '/public/css',
      'html': '/public/html',
      'img': '/public/images',
      'js': '/public/js'
    },
    [process.env.NODE_ENV || 'production']: {
      'css': '/.min/css',
      'html': '/public/html',
      'img': '/public/images',
      'js': '/.min/js'
    }
  };
};
