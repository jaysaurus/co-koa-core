module.exports = function (conf) {
  var sayHelloCalled = false;

  return {
    sayHello: function () {
      sayHelloCalled = true;
    },

    saidHello: function () {
      return sayHelloCalled;
    }
  };
};
