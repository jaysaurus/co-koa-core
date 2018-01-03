module.exports = function (app, conf) {
  var bmMiddlewareCalled = false;

  return {
    build: function () {
      bmMiddlewareCalled = true;
    },

    wasCalled: function () {
      return bmMiddlewareCalled;
    }
  };
};
