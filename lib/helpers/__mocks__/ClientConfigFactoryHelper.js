module.exports = env => {
  return {
    getEchoObject (env) {
      if (typeof env === 'string') {
        return {
          throw (name, error) {
            throw new Error(`${name}: ${error}`);
          }
        };
      } else return undefined;
    },
    getEnvConfig () {
      throw new Error('Mock getEnvConfig threw an exception');
    }
  };
};
