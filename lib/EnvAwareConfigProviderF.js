'use strict';

require("source-map-support/register");

const path = require('path');

const {
  _
} = require('@genx/july');

const EnvAwareConfigProviderF = (EXT, PROVIDER, DEFAULT_FLAG = 'default') => class {
  constructor(configDir, baseName, envFlag = 'development') {
    this._defConfigProvider = new PROVIDER(path.join(configDir, baseName + '.' + DEFAULT_FLAG + EXT));
    this._envConfigProvider = new PROVIDER(path.join(configDir, baseName + '.' + envFlag + EXT));
    this._envFlag = envFlag;
    this.config = undefined;
  }

  async load_(logger) {
    let defConfig = await this._defConfigProvider.load_(logger);
    let envConfig = await this._envConfigProvider.load_(logger);
    this.config = _.defaults({}, envConfig, defConfig);

    if (logger && !_.isEmpty(envConfig)) {
      logger.log('info', `Configuration is overrided by environment-specific [env=${this._envFlag}] settings.`);
    }

    return this.config;
  }

  async save_() {
    await this._envConfigProvider.save_();
  }

  setItem(key, value) {
    _.set(this.config, key, value);

    this._envConfigProvider.setItem(key, value);

    return this;
  }

  getItem(key, defaultValue) {
    return _.get(this.config, key, defaultValue);
  }

};

module.exports = EnvAwareConfigProviderF;
//# sourceMappingURL=EnvAwareConfigProviderF.js.map