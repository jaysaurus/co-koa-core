'use strict';

const mongoose = require('mongoose');
const stampit = require('stampit');

const TreeAlgorithm = require('./resources/TreeAlgorithm.js');

const ModelFactoryHelper = stampit({
  init () {
    function bindVirtuals (schema, virtuals) {
      Object.keys(virtuals).forEach(key => {
        const virtual = schema.virtual(key);
        ['get', 'set'].forEach(getSet => {
          if (virtuals[key].hasOwnProperty(getSet)) {
            virtual[getSet](virtuals[key][getSet]);
          }
        });
      });
    }

    Object.assign(this, {
      bindClientModelToSchema (model, schema) {
        return Object.keys(model).reduce((statics, key) => {
          switch (key) {
            case 'index':
            case 'methods':
              Object.assign(schema[key], model[key]);
              break;
            case 'statics':
              statics = Object.keys(model[key]);
              Object.assign(schema[key], model[key]);
              break;
            case 'virtuals':
              bindVirtuals(schema, model[key]);
              break;
          }
          return statics;
        }, []);
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
      },

      injectSchemaObjectIds (schema) {
        TreeAlgorithm(schema).process((it) => {
          if (typeof it.item === 'string' && it.key === 'type') {
            switch (it.item) {
              case 'ObjectId':
              case 'ForeignKey':
              case 'FK':
                let pointer = it._out;
                it._keyTree.forEach(key => {
                  pointer = pointer[key]; // fastforward the pointer through linkedList
                });
                pointer[it.key] = mongoose.Schema.Types.ObjectId;
            }
          }
        });
      }
    });
  }
});

module.exports = () => ModelFactoryHelper();
