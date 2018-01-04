module.exports = (env, throwEnvironmentError) => {
  return {
    log (message) { return env === 'test' ? console.log(message) : throwEnvironmentError(); },
    error: console.error
  };
};
