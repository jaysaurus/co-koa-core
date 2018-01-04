// const koa = jest.genMockFromModule('koa');
//
// koa.use =

var observedCalls = [];

module.exports = function Koa () {
  const _this = this;
  this.setObserver = function (arg) {
    observedCalls = arg;
  };
  this.getObserver = function () {
    return observedCalls;
  };

  this.use = function (arg) {
    observedCalls.push(arg);
    return _this;
  };

  this.IAmKoa = true;
};
