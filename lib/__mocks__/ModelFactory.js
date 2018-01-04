var modelFactoryCalled = [];

var obj = {
  build: function (call) {
    modelFactoryCalled.push(call);
  },
  setSpy: function (arg) {
    modelFactoryCalled = arg;
  },
  getSpy: function () {
    return modelFactoryCalled;
  }
};

module.exports = function (conf) {
  return obj;
};
