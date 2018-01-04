var spy = [];
const obj = {
  setSpy (arr) {
    spy = arr;
  },
  getSpy () {
    return spy;
  },
  build: function (env) {
    spy.push(env);
    return {
      env: {
        port: 3000
      },
      logger: {
        log (call) {

        }
      }
    };
  }
};

module.exports = function ClientConfigFactory (root) {
  return obj;
};
