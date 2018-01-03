module.exports = function koa () {
  const observedCalls = [];
  this.getObserver = function () {
    return observedCalls;
  };

  this.use = function (arg) {
    observedCalls.push(arg);
  };
};
