'use strict';

const mongoose = require('mongoose');
const stampit = require('stampit');

const ModelFactoryHelper = stampit({
  init () { },
  methods: {
    assignVirtuals (schema, virtuals) {
      Object.keys(virtuals).forEach(key => {
        const virtual = schema.virtual(key);
        ['get', 'set'].forEach(getSet => {
          if (virtuals[key].hasOwnProperty(getSet)) {
            virtual[getSet](virtuals[key][getSet]);
          }
        });
      });
    },

    buildTypeCallback (echo) {
      return function (type, typeName) {
        const tName = typeName.replace('models', '');
        function newType (key, options) {
          mongoose.SchemaType.call(this, key, options, tName);
        }
        if (tName[0] === tName[0].toUpperCase()) {
          newType.prototype = Object.create(mongoose.SchemaType.prototype);
          newType.prototype.cast = type;
          mongoose.Schema.Types[tName] = newType;
          return mongoose;
        } else echo.throw('invalidTypeName', tName);
      };
    }
  }
});

module.exports = () => ModelFactoryHelper();
