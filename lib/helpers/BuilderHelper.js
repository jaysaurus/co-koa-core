'use strict';

const stampit = require('stampit');

const BuilderHelper = stampit({
  init ({ conf, echo }) {
    const nameMatchesConvention = (name, type) => {
      let t = type.replace(/^[A-Za-z]+\//, '');
      return name.match(`${t.charAt(0).toUpperCase() + t.slice(1)}$`);
    };

    this.appendFileCommands = function (fileNames, type, callback) {
      if (fileNames) {
        const dirName = `${type.toLowerCase()}s`;
        fileNames.forEach(fileName => {
          const suffix = type.match(/[A-Za-z]+$/); // e.g. dir/SubDir -> "SubDir"
          const name = fileName.replace(/\.js$/, '');  // e.g. fileName.js -> "fileName"
          if (type === 'Model' || nameMatchesConvention(name, type)) {
            const file = require(`${conf.root}/api/${dirName}/${name}`);
            const objectName = name.replace(suffix, '');
            callback(file, objectName);
          } else {
            echo.log('invalidType', fileName, dirName);
          }
        });
      }
    };

    this.reduceToFiles = function (list, fileName) {
      if (fileName.match(/\.js$/)) list.push(fileName);
      return list;
    };
  }
});

module.exports = (conf, echo) => BuilderHelper({ conf, echo });
