module.exports = function ({ conf, dir, parent }) {
  return {
    echo: {
      throw (str, item1, item2) {
        conf.push(str);
        if (item1) conf.push(item1);
        if (item2) conf.push(item2);
        if (str === 'invalidType') {
          throw new Error(str);
        }
      }
    },
    fetchToken (item) { return 'Token fetched'; },
    fetchFile (arg, item) { return 'File fetched'; }
  };
};
