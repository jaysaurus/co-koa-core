module.exports = function (conf) {
  var ControllerFactoryCalled = [];

  return {
    build: function (call, dm) {
      ControllerFactoryCalled.push(conf);
      ControllerFactoryCalled.push(call);
      ControllerFactoryCalled.push(dm);
    },

    wasCalled: function () {
      return ControllerFactoryCalled;
    }
  };
};
