"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithElastic = composeWithElastic;

var _graphqlCompose = require("graphql-compose");

var _mappingConverter = require("./mappingConverter");

var _search = _interopRequireDefault(require("./resolvers/search"));

var _searchConnection = _interopRequireDefault(require("./resolvers/searchConnection"));

var _searchPagination = _interopRequireDefault(require("./resolvers/searchPagination"));

var _findById = _interopRequireDefault(require("./resolvers/findById"));

var _updateById = _interopRequireDefault(require("./resolvers/updateById"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function composeWithElastic(opts) {
  if (!opts) {
    throw new Error('Opts is required argument for composeWithElastic()');
  }

  if (!opts.elasticMapping || !opts.elasticMapping.properties) {
    throw new Error('You provide incorrect elasticMapping property. It should be an object `{ properties: {} }`');
  }

  if (!opts.elasticIndex || typeof opts.elasticIndex !== 'string') {
    throw new Error('Third arg for Resolver search() should contain `elasticIndex` string property from your Elastic server.');
  }

  if (!opts.elasticType || typeof opts.elasticType !== 'string') {
    throw new Error('Third arg for Resolver search() should contain `elasticType` string property from your Elastic server.');
  }

  if (typeof opts.graphqlTypeName !== 'string' || !opts.graphqlTypeName) {
    throw new Error('Opts.graphqlTypeName is required property for generated GraphQL Type name in composeWithElastic()');
  }

  if (!opts.prefix) {
    opts.prefix = opts.graphqlTypeName; // eslint-disable-line
  }

  if (opts.pluralFields && !Array.isArray(opts.pluralFields)) {
    throw new Error('Opts.pluralFields should be an Array of strings with field names ' + 'which are plural (you may use dot notation for nested fields).');
  }

  if (opts.schemaComposer && !(opts.schemaComposer instanceof _graphqlCompose.SchemaComposer)) {
    throw new Error('Opts.schemaComposer should be an SchemaComposer instance from graphql-compose package.');
  }

  const schemaComposer = opts.schemaComposer || _graphqlCompose.schemaComposer;
  const fieldMap = (0, _mappingConverter.inputPropertiesToGraphQLTypes)(opts.elasticMapping);
  const sourceTC = (0, _mappingConverter.convertToSourceTC)(schemaComposer, opts.elasticMapping, opts.graphqlTypeName, opts);
  const commonOpts = (0, _utils.prepareCommonOpts)(schemaComposer, _objectSpread({}, opts, {
    prefix: opts.prefix || 'Es',
    fieldMap,
    sourceTC,
    schemaComposer
  }));
  const searchR = (0, _search.default)(commonOpts);
  const searchConnectionR = (0, _searchConnection.default)(commonOpts, searchR);
  const searchPaginationR = (0, _searchPagination.default)(commonOpts, searchR);
  const findByIdR = (0, _findById.default)(commonOpts);
  const updateByIdR = (0, _updateById.default)(commonOpts);
  sourceTC.addResolver(searchR);
  sourceTC.addResolver(searchConnectionR);
  sourceTC.addResolver(searchPaginationR);
  sourceTC.addResolver(findByIdR);
  sourceTC.addResolver(updateByIdR);
  return sourceTC;
}