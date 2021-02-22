"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFindByIdResolver;

var _graphqlCompose = require("graphql-compose");

var _ElasticApiParser = _interopRequireDefault(require("../ElasticApiParser"));

var _FindByIdOutput = require("../types/FindByIdOutput");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createFindByIdResolver(opts) {
  const {
    fieldMap,
    sourceTC,
    schemaComposer
  } = opts;

  if (!fieldMap || !fieldMap._all) {
    throw new Error('opts.fieldMap for Resolver findById() should be fieldMap of FieldsMapByElasticType type.');
  }

  if (!sourceTC || sourceTC.constructor.name !== 'ObjectTypeComposer') {
    throw new Error('opts.sourceTC for Resolver findById() should be instance of ObjectTypeComposer.');
  }

  const parser = new _ElasticApiParser.default({
    elasticClient: opts.elasticClient,
    prefix: opts.prefix
  });
  const findByIdFC = parser.generateFieldConfig('get', {
    index: opts.elasticIndex,
    type: opts.elasticType
  });
  const type = (0, _FindByIdOutput.getFindByIdOutputTC)(opts);
  return schemaComposer.createResolver({
    type,
    name: 'findById',
    kind: 'query',
    args: {
      id: 'String!'
    },
    resolve: async rp => {
      const {
        source,
        args,
        context,
        info
      } = rp;

      if (!args.id) {
        throw new Error(`Missed 'id' argument!`);
      }

      const res = await findByIdFC.resolve(source, args, context, info);
      const {
        _index,
        _type,
        _id,
        _version,
        _source
      } = res || {};
      return _objectSpread({
        _index,
        _type,
        _id,
        _version
      }, _source);
    }
  });
}