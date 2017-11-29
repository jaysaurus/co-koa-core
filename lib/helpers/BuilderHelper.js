'use strict';

const stampit = require('stampit');

const BuilderHelper = stampit({
  init ({ conf, echo }) {
    const nameMatchesConvention = (name, type) => name.match(`${type.replace(/^[A-Za-z]+\//, '')}$`);

    Object.assign(this, {
      appendFileCommands (fileNames, type, callback) {
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
      },

      reduceToFiles (list, fileName) {
        if (fileName.match(/\.js$/)) list.push(fileName);
        return list;
      }
    });
  }
});

module.exports = (conf, echo) => BuilderHelper({ conf, echo });
