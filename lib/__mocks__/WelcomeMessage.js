var sayHelloCalled = false;

const obj = {
  sayHello: function () {
    sayHelloCalled = true;
  },

  saidHello: function () {
    return sayHelloCalled;
  }
};

module.exports = function (conf) {
  return obj;
};
