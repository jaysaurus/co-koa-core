'use strict';

const echoHandler = require('echo-handler');
const mongoose = require('mongoose');
const stampit = require('stampit');

const Builder = require('./Builder');
const ModelFactoryHelper = require('./helpers/ModelFactoryHelper.js');
const MongooseTypeNumberEnums = require('mongoose-type-number-enums');

const ModelFactory = stampit({
  init (conf) {
    const builder = Builder(conf);
    const echo = echoHandler.configure({
      factoryOverride: `${__dirname}/i18n/${conf.i18n}.depManMessages.json`,
      logger: conf.logger });
    const helper = ModelFactoryHelper(echo);
    const mongooseEnums = new MongooseTypeNumberEnums(conf.i18n);

    const buildModelCallback = ($) => {
      return (modelCallback, modelName) => {
        const model = modelCallback($);
        if (model.hasOwnProperty('schema')) {
          const schema = new mongoose.Schema(model.schema, (model.hasOwnProperty('options') ? model.options : undefined));
          let statics = [];
          Object.keys(model).forEach(key => {
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
                helper.assignVirtuals(schema, model[key]);
                break;
            }
          });
          const Model = mongoose.model(modelName, schema);
          statics.forEach(func => { // bind Model class as 'this' to statics
            Model[func] = Model[func].bind(Model);
          });
        } else this.echo.throw('noSchema', modelName);
      };
    };

    Object.assign(this, {
      build ($) {
        mongooseEnums.upgradeMongoose(mongoose); // allow numeric Enum support by default
        builder.build('models/Type', helper.buildTypeCallback(echo));
        builder.build('Model', buildModelCallback($));
      }
    });
  }
});

module.exports = conf => ModelFactory(conf);
