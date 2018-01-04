var argv = {
  environment: 'test'
};

var alias = function () {
  return {argv};
};

var help = function () {
  return {alias};
};

var options = function (environment) {
  return {help};
};

module.exports = {options, clearArgvEnvironment () { argv.environment = null; }};
