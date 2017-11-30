module.exports = function (conf) {
  return {
    build (type, callback) {
      if (conf.spy) {
        conf.spy.push({ [type]: callback });
      }
    }
  };
};
