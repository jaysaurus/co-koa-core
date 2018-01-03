module.exports = function (conf) {
  var modelFactoryCalled = [];
  return {
    build: function (call) {
      modelFactoryCalled.push(conf);
      modelFactoryCalled.push(call);
    },

    wasCalled: function () {
      return modelFactoryCalled;
    }
  };
};
