module.exports = {
  bootstrapCalled: false,
  bootstrap: function (val) {
    this.bootstrapCalled = true;
  }
};
