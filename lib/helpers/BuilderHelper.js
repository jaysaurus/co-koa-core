const stampit = require('stampit');

const BuilderHelper = stampit({
  init ({ conf, echo }) {
    const nameMatchesType = (name, type) => name.match(`${type.replace(/^[A-Za-z]+\//, '')}$`);

    Object.assign(this, {
      appendFileCommands (files, type, next) {
        if (files) {
          const dirName = `${type.toLowerCase()}s`;
          files.forEach(file => {
            const suffix = type.match(/[A-Za-z]+$/); // e.g. dir/SubDir -> "SubDir"
            const name = file.replace(/\.js$/, '');  // e.g. file.js -> "file"
            if (type === 'Model' || nameMatchesType(name, type)) {
              const requirement = require(`${conf.root}/api/${dirName}/${name}`);
              const objectName = name.replace((suffix ? suffix[0] : ''), '');
              next(requirement, objectName);
            } else echo.log('invalidType', file, dirName);
          });
        }
      },

      reduceToFiles (list, file) {
        if (file.match(/\.js$/)) list.push(file);
        return list;
      }

    });
  }
});

module.exports = (conf, echo) => BuilderHelper({ conf, echo });
