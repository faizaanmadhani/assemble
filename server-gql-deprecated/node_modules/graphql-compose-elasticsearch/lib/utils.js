"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareCommonOpts = prepareCommonOpts;
exports.getTypeName = getTypeName;
exports.desc = desc;
exports.reorderKeys = reorderKeys;
exports.fetchElasticMapping = fetchElasticMapping;

var _graphqlCompose = require("graphql-compose");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function prepareCommonOpts(schemaComposer, opts = {}) {
  return _objectSpread({
    schemaComposer,
    getOrCreateOTC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createObjectTC((0, _graphqlCompose.isFunction)(cfgOrThunk) ? cfgOrThunk() : cfgOrThunk);
        return tc;
      });
    },
    getOrCreateITC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createInputTC((0, _graphqlCompose.isFunction)(cfgOrThunk) ? cfgOrThunk() : cfgOrThunk);
        return tc;
      });
    },
    getOrCreateETC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createEnumTC((0, _graphqlCompose.isFunction)(cfgOrThunk) ? cfgOrThunk() : cfgOrThunk);
        return tc;
      });
    }
  }, opts);
}

function getTypeName(name, opts) {
  return `${opts && opts.prefix || 'Elastic'}${name}${opts && opts.postfix || ''}`;
} // Remove newline multiline in descriptions


function desc(str) {
  return str.replace(/\n\s+/gi, ' ').replace(/^\s+/, '');
}

function reorderKeys(obj, names) {
  const orderedFields = {};

  const fields = _objectSpread({}, obj);

  names.forEach(name => {
    if (fields[name]) {
      orderedFields[name] = fields[name];
      delete fields[name];
    }
  });
  return _objectSpread({}, orderedFields, {}, fields);
}

async function fetchElasticMapping(opts) {
  if (!opts.elasticIndex || typeof opts.elasticIndex !== 'string') {
    throw new Error('Must provide `elasticIndex` string parameter from your Elastic server.');
  }

  if (!opts.elasticType || typeof opts.elasticType !== 'string') {
    throw new Error('Must provide `elasticType` string parameter from your Elastic server.');
  }

  if (!opts.elasticClient) {
    throw new Error('Must provide `elasticClient` Object parameter connected to your Elastic server.');
  }

  const elasticMapping = await opts.elasticClient.indices.getMapping({
    index: opts.elasticIndex,
    type: opts.elasticType
  }); // Try index name, else resort to Value in case Index name is an alias

  const baseIndex = elasticMapping[opts.elasticIndex] || Object.values(elasticMapping)[0];
  return baseIndex.mappings[opts.elasticType];
}