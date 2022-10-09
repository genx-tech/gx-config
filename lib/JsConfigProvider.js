'use strict';

const {
  fs,
  load_
} = require('@genx/sys');

const JsonConfigProvider = require('./JsonConfigProvider.js');
/**
 * JavaScirpt module file config data source
 * @class JsConfigProvider
 * @extends JsonConfigProvider
 */


class JsConfigProvider extends JsonConfigProvider {
  /**
   * Start loading the config files
   * @returns {Promise.<object>}
   */
  async load_(logger) {
    if (await fs.pathExists(this.filePath)) {
      this.config = await load_(this.filePath); // load js into sandbox

      if (logger) {
        logger.log('info', `Configuration is loaded from "${this.filePath}"`);
      }
    } else {
      this.config = {};
    }

    return this.config;
  }
  /**
   * Start saving the config to files
   * @returns {Promise.<*>}
   */


  async save_() {
    return fs.outputFile(this.filePath, 'module.exports = ' + JSON.stringify(this.config, null, 4) + ';');
  }

}

module.exports = JsConfigProvider;
//# sourceMappingURL=JsConfigProvider.js.map