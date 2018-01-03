module.exports = function ClientConfigFactory (root) {
  return {
    build: function (env) {
      const spy = [];
      spy.push(root);
      spy.push(env);
      return {
        env: {
          port: spy
        },
        logger: {
          log (call) {

          }
        }
      };
    }
  };
};
