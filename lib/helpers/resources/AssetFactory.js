const stampit = require('stampit');
const fs = require('fs');

const AssetFactory = stampit({
  init ({ conf, echo }) {
    const hasClientConfig = fs.statSync(`${conf.root}/config/AssetConfig.js`);
    if (!hasClientConfig) echo.error('missingAssetConfig');

    const assetConfig = Object.assign(
      {},
      require(
        (hasClientConfig)
          ? `${conf.root}/config/AssetConfig.js`
          : `${__dirname}/AssetConfig.default.js`));

    Object.assign(this, {
      build (assetType) {
        return Object.assign({}, {
          loadURL (fileName, fileExtension = '') {
            try {
              const type = assetType.replace(/^:/, '');
              const directory = assetConfig[conf.environment][type].replace(/\/$/, '');
              return `${directory}/${fileName}.${fileExtension || type}`;
            } catch (e) { echo.throw('invalidAsset', assetType); }
          }
        });
      }
    });
  }
});

module.exports = (conf, echo) => AssetFactory({ conf, echo });
//
// module.exports = function AssetHandler (tokenName, conf) {
//   var dir = tokenName.replace(/^:/, '');
//   switch (conf.environment) {
//     case 'development':
//     case 'test':
//     default:
//       return {
//         get: (file) => {
//           switch (dir) {
//             case 'css':
//             case 'js':
//             case 'html':
//               return `${conf.root}/public/${dir}/${file}`;
//           }
//         }
//       };
//     case process.env.NODE_ENV:
//       return 'TODO'; // uglified data goes here.
//   }
// };
