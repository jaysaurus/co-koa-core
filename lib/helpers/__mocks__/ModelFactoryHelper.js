module.exports = function () {
  return {
    bindClientModelToSchema (modelName, schema) {
      schema.spy.push('bindClientModelToSchema was called')
      return ['foo', 'bar'];
    },
    buildTypeCallback (echo) {
      return 'buildTypeCallback Called';
    }
  };
};