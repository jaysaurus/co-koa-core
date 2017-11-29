module.exports = function (conf, dir, parent) {
  return {
    appendConfigToCallerMethod () {
      if (!conf.length) {
        conf.push('appendConfigToCallerMethod called');
      } else throw new Error('test');
    },
    echo: {
      throw (str, item1, item2) {
        conf.push(str);
        conf.push(item1);
        conf.push(item2);
      }
    },
    fetchToken (item) { return 'Token fetched'; },
    fetchFile (arg, item) { return 'File fetched'; }
  };
};
