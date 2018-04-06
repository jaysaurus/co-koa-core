var spy = [];
const obj = {
  setSpy (arr) {
    spy = arr;
  },
  getSpy () {
    return spy;
  },
  build: function (env) {
    if (spy instanceof Array) spy.push(env);
    return {
      env: {
        port: 3000
      },
      logger: {
        log (call) {

        }
      },
      welcomeMessage: spy instanceof Array
    };
  }
};

module.exports = function ClientConfigFactory (root) {
  return obj;
};
