'use strict';

const fs = require('fs');
const stampit = require('stampit');

const AssetFactory = stampit({
  init ({ conf, echo }) {
    let hasClientConfig;
    try {
      hasClientConfig = fs.statSync(`${conf.root}/config/AssetConfig.js`);
    } catch (e) { echo.error('missingAssetConfig'); }

    const assetConfig = require(
      (hasClientConfig) ? `${conf.root}/config/AssetConfig.js` : `${__dirname}/AssetConfig.default.js`);

    this.build = function (assetType) {
      return Object.assign({}, {
        loadURL (fileName, fileExtension = '') {
          try {
            const type = assetType.replace(/^:/, '');
            const directory = assetConfig[conf.environment][type].replace(/\/$/, '');
            return `${directory}/${fileName}.${fileExtension || type}`;
          } catch (e) { echo.throw('invalidAsset', assetType); }
        },
        stream (fileName, fileExtension = '') {
          return fs.createReadStream(`${conf.root}/public${this.loadURL(fileName, fileExtension)}`);
        }
      });
    };
  }
});

module.exports = (conf, echo) => AssetFactory({ conf, echo });
