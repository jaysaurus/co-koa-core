let called = false;
const obj = {
  wasCalled () {
    return called;
  },
  init () {
    called = true;
  }
};

module.exports = function PluginManager () {
  return obj;
};
