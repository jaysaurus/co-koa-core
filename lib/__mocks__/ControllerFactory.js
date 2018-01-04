var ControllerFactoryCalled = [];

const obj = {
  build (call, dm) {
    ControllerFactoryCalled.push(call);
    ControllerFactoryCalled.push(dm);
  },

  setSpy (arr) {
    ControllerFactoryCalled = arr;
  }
};

module.exports = function (conf) {
  return obj;
};
