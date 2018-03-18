const bootstrap = function (val) {
  this.bootstrapCalled = true;
};

bootstrap.bootstrapCalled = false;

module.exports = bootstrap;
