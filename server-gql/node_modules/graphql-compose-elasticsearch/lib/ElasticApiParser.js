"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dox = _interopRequireDefault(require("dox"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _graphqlCompose = require("graphql-compose");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ElasticApiParser {
  constructor(opts = {}) {
    // avaliable versions can be found in installed package `elasticsearch`
    // in file /node_modules/elasticsearch/src/lib/apis/index.js
    this.apiVersion = opts.apiVersion || opts.elasticClient && opts.elasticClient.transport && opts.elasticClient.transport._config && opts.elasticClient.transport._config.apiVersion || '_default';

    const apiFilePath = _path.default.resolve(opts.elasticApiFilePath || ElasticApiParser.findApiVersionFile(this.apiVersion));

    const source = ElasticApiParser.loadApiFile(apiFilePath);
    this.parsedSource = ElasticApiParser.parseSource(source);
    this.elasticClient = opts.elasticClient;
    this.prefix = opts.prefix || 'Elastic';
    this.cachedEnums = {};
  }

  static loadFile(absolutePath) {
    return _fs.default.readFileSync(absolutePath, 'utf8');
  }

  static loadApiFile(absolutePath) {
    let code;

    try {
      code = ElasticApiParser.loadFile(absolutePath);
    } catch (e) {
      throw new Error(`Cannot load Elastic API source file from ${absolutePath}`);
    }

    return ElasticApiParser.cleanUpSource(code);
  }

  static loadApiListFile(absolutePath) {
    let code;

    try {
      code = ElasticApiParser.loadFile(absolutePath);
    } catch (e) {
      throw new Error(`Cannot load Elastic API file with avaliable versions from ${absolutePath}`);
    }

    return code;
  }

  static findApiVersionFile(version) {
    const esModulePath = _path.default.dirname(require.resolve('elasticsearch'));

    const apiFolder = `${esModulePath}/lib/apis/`;

    const apiListFile = _path.default.resolve(apiFolder, 'index.js');

    const apiListCode = ElasticApiParser.loadApiListFile(apiListFile); // parsing elasticsearch module 13.x and above
    //   get '5.3'() { return require('./5_3'); },

    const re = new RegExp(`\\'${version}\\'\\(\\).*require\\(\\'(.+)\\'\\)`, 'gi');
    const match = re.exec(apiListCode);

    if (match && match[1]) {
      return _path.default.resolve(apiFolder, `${match[1]}.js`);
    } // parsing elasticsearch module 12.x and below
    //   '5.0': require('./5_0'),


    const re12 = new RegExp(`\\'${version}\\':\\srequire\\(\\'(.+)\\'\\)`, 'gi');
    const match12 = re12.exec(apiListCode);

    if (match12 && match12[1]) {
      return _path.default.resolve(apiFolder, `${match12[1]}.js`);
    }

    throw new Error(`Can not found Elastic version '${version}' in ${apiListFile}`);
  }

  static cleanUpSource(code) {
    // remove invalid markup
    // {<<api-param-type-boolean,`Boolean`>>} converted to {Boolean}
    let codeCleaned = code.replace(/{<<.+`(.*)`.+}/gi, '{$1}'); // replace api.indices.prototype['delete'] = ca({
    // on api.indices.prototype.delete = ca({

    codeCleaned = codeCleaned.replace(/(api.*)\['(.+)'\](.*ca)/gi, '$1.$2$3');
    return codeCleaned;
  }

  static parseParamsDescription(doxItemAST) {
    const descriptions = {};

    if (Array.isArray(doxItemAST.tags)) {
      doxItemAST.tags.forEach(tag => {
        if (!tag || tag.type !== 'param') return;
        if (tag.name === 'params') return;
        const name = ElasticApiParser.cleanupParamName(tag.name);
        if (!name) return;
        descriptions[name] = ElasticApiParser.cleanupDescription(tag.description);
      });
    }

    return descriptions;
  }

  static cleanupDescription(str) {
    if (typeof str === 'string') {
      if (str.startsWith('- ')) {
        str = str.substr(2);
      }

      str = str.trim();
      return str;
    }

    return undefined;
  }

  static cleanupParamName(str) {
    if (typeof str === 'string') {
      if (str.startsWith('params.')) {
        str = str.substr(7);
      }

      str = str.trim();
      return str;
    }

    return undefined;
  }

  static codeToSettings(code) {
    // find code in ca({});
    const reg = /ca\((\{(.|\n)+\})\);/g;
    const matches = reg.exec(code);

    if (matches && matches[1]) {
      return eval('(' + matches[1] + ')'); // eslint-disable-line no-eval
    }

    return undefined;
  }

  static getMethodName(str) {
    const parts = str.split('.');

    if (parts[0] === 'api') {
      parts.shift();
    }

    if (parts.length === 1) {
      return parts[0];
    } else {
      return parts.filter(o => o !== 'prototype');
    }
  }

  static parseSource(source) {
    const result = {};

    if (!source || typeof source !== 'string') {
      throw Error('Empty source. It should be non-empty string.');
    }

    const doxAST = _dox.default.parseComments(source, {
      raw: true
    });

    if (!doxAST || !Array.isArray(doxAST)) {
      throw Error('Incorrect responce from dox.parseComments');
    }

    doxAST.forEach(item => {
      if (!item.ctx || !item.ctx.string) {
        return;
      } // method description


      let description;

      if (item.description && item.description.full) {
        description = ElasticApiParser.cleanupDescription(item.description.full);
      }

      const elasticMethod = ElasticApiParser.getMethodName(item.ctx.string);
      const dottedMethodName = Array.isArray(elasticMethod) ? elasticMethod.join('.') : elasticMethod;
      result[dottedMethodName] = {
        elasticMethod,
        description,
        argsSettings: ElasticApiParser.codeToSettings(item.code),
        argsDescriptions: ElasticApiParser.parseParamsDescription(item)
      };
    });
    return result;
  }

  generateFieldMap() {
    const result = {};
    Object.keys(this.parsedSource).forEach(methodName => {
      result[methodName] = this.generateFieldConfig(methodName);
    });
    const fieldMap = this.reassembleNestedFields(result);
    return (0, _utils.reorderKeys)(fieldMap, ['cat', 'cluster', 'indices', 'ingest', 'nodes', 'snapshot', 'tasks', 'search']);
  }

  generateFieldConfig(methodName, methodArgs) {
    if (!methodName) {
      throw new Error(`You should provide Elastic search method.`);
    }

    if (!this.parsedSource[methodName]) {
      throw new Error(`Elastic search method '${methodName}' does not exists.`);
    }

    const {
      description,
      argsSettings,
      argsDescriptions,
      elasticMethod
    } = this.parsedSource[methodName];
    const argMap = this.settingsToArgMap(argsSettings, argsDescriptions);
    return {
      type: 'JSON',
      description,
      args: argMap,
      // eslint-disable-next-line no-unused-vars
      resolve: (source, args, context, info) => {
        const client = context && context.elasticClient || this.elasticClient;

        if (!client) {
          throw new Error('You should provide `elasticClient` when created types via ' + '`opts.elasticClient` or in runtime via GraphQL context');
        }

        if (Array.isArray(elasticMethod)) {
          return client[elasticMethod[0]][elasticMethod[1]](_objectSpread({}, methodArgs, {}, args));
        }

        return client[elasticMethod](_objectSpread({}, methodArgs, {}, args));
      }
    };
  }

  paramToGraphQLArgConfig(paramCfg, fieldName, description) {
    const result = {
      type: this.paramTypeToGraphQL(paramCfg, fieldName)
    };

    if (paramCfg.default) {
      result.defaultValue = paramCfg.default;

      if (result.type === 'Float' || result.type === 'Int') {
        const defaultNumber = Number(result.defaultValue);

        if (Number.isNaN(defaultNumber)) {
          // Handle broken data where default is not valid for the given type
          // https://github.com/graphql-compose/graphql-compose-elasticsearch/issues/49
          delete result.defaultValue;
        } else {
          result.defaultValue = defaultNumber;
        }
      } else if (result.type === 'Boolean') {
        const t = result.defaultValue;
        result.defaultValue = t === 'true' || t === '1' || t === true;
      }
    } else if (fieldName === 'format') {
      result.defaultValue = 'json';
    }

    if (description) {
      result.description = description;
    }

    return result;
  }

  paramTypeToGraphQL(paramCfg, fieldName) {
    switch (paramCfg.type) {
      case 'string':
        return 'String';

      case 'boolean':
        return 'Boolean';

      case 'number':
        return 'Float';

      case 'time':
        return 'String';

      case 'list':
        return 'JSON';

      case 'enum':
        if (Array.isArray(paramCfg.options)) {
          return this.getEnumType(fieldName, paramCfg.options);
        }

        return 'String';

      case undefined:
        // some fields may not have type definition in API file,
        // eg '@param {anything} params.operationThreading - ?'
        return 'JSON';

      default:
        // console.log(
        //   // eslint-disable-line
        //   `New type '${paramCfg.type}' in elastic params setting for field ${fieldName}.`
        // );
        return 'JSON';
    }
  }

  getEnumType(fieldName, vals) {
    const key = fieldName;
    const subKey = JSON.stringify(vals);

    if (!this.cachedEnums[key]) {
      this.cachedEnums[key] = {};
    }

    if (!this.cachedEnums[key][subKey]) {
      const values = vals.reduce((result, val) => {
        if (val === '') {
          result.empty_string = {
            value: ''
          };
        } else if (val === 'true') {
          result.true_string = {
            value: 'true'
          };
        } else if (val === true) {
          result.true_boolean = {
            value: true
          };
        } else if (val === 'false') {
          result.false_string = {
            value: 'false'
          };
        } else if (val === false) {
          result.false_boolean = {
            value: false
          };
        } else if (val === 'null') {
          result.null_string = {
            value: 'null'
          };
        } else if (Number.isFinite(val)) {
          result[`number_${val}`] = {
            value: val
          };
        } else if (typeof val === 'string') {
          result[val] = {
            value: val
          };
        }

        return result;
      }, {});
      let postfix = Object.keys(this.cachedEnums[key]).length;
      if (postfix === 0) postfix = '';else postfix = `_${postfix}`;
      this.cachedEnums[key][subKey] = _graphqlCompose.EnumTypeComposer.createTemp({
        name: `${this.prefix}Enum_${(0, _graphqlCompose.upperFirst)(fieldName)}${postfix}`,
        values
      });
    }

    return this.cachedEnums[key][subKey];
  }

  settingsToArgMap(settings, descriptions = {}) {
    const result = {};
    const {
      params,
      urls,
      url,
      method,
      needBody
    } = settings || {};

    if (method === 'POST' || method === 'PUT') {
      result.body = {
        type: needBody ? 'JSON!' : 'JSON'
      };
    }

    if (params) {
      Object.keys(params).forEach(k => {
        const fieldConfig = this.paramToGraphQLArgConfig(params[k], k, descriptions[k]);

        if (fieldConfig) {
          result[k] = fieldConfig;
        }
      });
    }

    const urlList = urls || (url ? [url] : null);

    if (Array.isArray(urlList)) {
      urlList.forEach(item => {
        if (item.req) {
          Object.keys(item.req).forEach(k => {
            const fieldConfig = this.paramToGraphQLArgConfig(item.req[k], k, descriptions[k]);

            if (fieldConfig) {
              result[k] = fieldConfig;
            }
          });
        }
      });
    }

    return result;
  }

  reassembleNestedFields(fields) {
    const result = {};
    Object.keys(fields).forEach(k => {
      const names = k.split('.');

      if (names.length === 1) {
        result[names[0]] = fields[k];
      } else {
        if (!result[names[0]]) {
          result[names[0]] = {
            type: _graphqlCompose.ObjectTypeComposer.createTemp({
              name: `${this.prefix}_${(0, _graphqlCompose.upperFirst)(names[0])}`,
              fields: () => {}
            }),
            resolve: () => {
              return {};
            }
          };
        }

        result[names[0]].type.setField(names[1], fields[k]);
      }
    });
    return result;
  }

}

exports.default = ElasticApiParser;