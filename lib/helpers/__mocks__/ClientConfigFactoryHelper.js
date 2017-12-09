module.exports = env => {
  return {
    getEchoObject (env) {
      if (typeof env === 'string') {
        return {
          throw (name, error) {
            throw new Error(`${name}: ${error}`);
          }
        };
      } else if (typeof env === 'number') return undefined;
      else Object.assign(this, { fatalError: 'Something went really wrong' });
    },
    getEnvConfig () {
      throw new Error('Mock getEnvConfig threw an exception');
    }
  };
};
