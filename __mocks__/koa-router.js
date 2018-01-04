var called = false;
var i = 0;
module.exports = function Router () {
  if (i === 1) {
    called = true;
  } else ++i;

  this.getCalled = function () {
    return called;
  };
  this.IAmARouter = true;
};
