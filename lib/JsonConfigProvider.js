'use strict';

require("source-map-support/register");

const {
  _
} = require('@genx/july');

const {
  fs
} = require('@genx/sys');

class JsonConfigProvider {
  constructor(filePath) {
    this.filePath = filePath;
    this.config = undefined;
  }

  async load_(logger) {
    if (await fs.pathExists(this.filePath)) {
      this.config = await fs.readJson(this.filePath);

      if (logger) {
        logger.log('info', `Configuration is loaded from "${this.filePath}"`);
      }
    } else {
      this.config = {};
    }

    return this.config;
  }

  async save_() {
    await fs.outputJson(this.filePath, this.config, {
      spaces: 4
    });
  }

  setItem(key, value) {
    _.set(this.config, key, value);

    return this;
  }

  getItem(key, defaultValue) {
    return _.get(this.config, key, defaultValue);
  }

}

module.exports = JsonConfigProvider;
//# sourceMappingURL=JsonConfigProvider.js.map