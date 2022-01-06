'use strict';

require("source-map-support/register");

const {
  fs,
  load_
} = require('@genx/sys');

const JsonConfigProvider = require('./JsonConfigProvider.js');

class JsConfigProvider extends JsonConfigProvider {
  async load_(logger) {
    if (await fs.pathExists(this.filePath)) {
      this.config = await load_(this.filePath);

      if (logger) {
        logger.log('info', `Configuration is loaded from "${this.filePath}"`);
      }
    } else {
      this.config = {};
    }

    return this.config;
  }

  async save_() {
    return fs.outputFile(this.filePath, 'module.exports = ' + JSON.stringify(this.config, null, 4) + ';');
  }

}

module.exports = JsConfigProvider;
//# sourceMappingURL=JsConfigProvider.js.map