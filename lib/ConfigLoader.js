'use strict';

require("source-map-support/register");

const vm = require('vm');

const {
  _,
  quote
} = require('@genx/july');

const JsonConfigProvider = require('./JsonConfigProvider.js');

const EnvAwareConfigProviderF = require('./EnvAwareConfigProviderF.js');

const EnvAwareJsonConfigProvider = EnvAwareConfigProviderF('.json', JsonConfigProvider);
const JS_VALUE_TOKEN = 'jsv';
const JS_TEMPLATE_TOKEN = 'jst';
const PROCESSOR_PREFIX = '#!';
const PrefixMap = new Map();
PrefixMap.set(JS_VALUE_TOKEN, (strVal, variables) => vm.runInNewContext('() => (' + strVal + ')', variables)());
PrefixMap.set(JS_TEMPLATE_TOKEN, (strVal, variables) => vm.runInNewContext(quote(strVal, '`'), variables));

class ConfigLoader {
  static createEnvAwareJsonLoader(configDir, baseName, envFlag, logger) {
    return new ConfigLoader(new EnvAwareJsonConfigProvider(configDir, baseName, envFlag), logger);
  }

  constructor(configProvider, logger) {
    this.provider = configProvider;
    this.data = undefined;
    this.autoPostProcess = true;
    this.logger = logger;
  }

  async load_(variables) {
    let oldData = this.data;
    await this.reload_(variables);

    if (oldData) {
      this.data = _.defaults(this.data, oldData);
    }

    return this.data;
  }

  async reload_(variables) {
    this.data = await this.provider.load_(this.logger);
    if (this.autoPostProcess) this.postProcess(variables);
    return this.data;
  }

  postProcess(variables) {
    let queue = [this.data];
    variables = { ...variables,
      $this: this.data
    };

    let interpolateElement = (coll, key, val) => {
      if (typeof val === 'string') {
        coll[key] = this._tryProcessStringValue(val, variables);
      } else if (_.isPlainObject(val) || _.isArray(val)) {
        queue.push(val);
      }
    };

    let offset = 0;

    while (queue.length > offset) {
      let node = queue[offset];

      if (_.isPlainObject(node)) {
        for (let key in node) {
          if (node.hasOwnProperty(key)) {
            interpolateElement(node, key, node[key]);
          }
        }
      } else {
        let l = node.length;

        for (let i = 0; i < l; i++) {
          interpolateElement(node, i, node[i]);
        }
      }

      offset++;
    }
  }

  _tryProcessStringValue(strVal, variables) {
    if (strVal.startsWith(PROCESSOR_PREFIX)) {
      let colon = strVal.indexOf(':');

      if (colon > 2) {
        let token = strVal.substring(2, colon);
        let operator = PrefixMap.get(token);

        if (operator) {
          return operator(strVal.substr(colon + 1), variables);
        }

        throw new Error('Unsupported interpolation method: ' + token);
      }

      throw new Error('Invalid interpolation syntax: ' + strVal);
    }

    return strVal;
  }

}

module.exports = ConfigLoader;
//# sourceMappingURL=ConfigLoader.js.map