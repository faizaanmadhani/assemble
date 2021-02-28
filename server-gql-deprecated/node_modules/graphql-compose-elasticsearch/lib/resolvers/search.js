"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSearchResolver;
exports.toDottedList = toDottedList;

var _graphqlCompose = require("graphql-compose");

var _ElasticApiParser = _interopRequireDefault(require("../ElasticApiParser"));

var _SearchBody = require("../elasticDSL/SearchBody");

var _SearchOutput = require("../types/SearchOutput");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createSearchResolver(opts) {
  const {
    fieldMap,
    sourceTC,
    schemaComposer
  } = opts;

  if (!fieldMap || !fieldMap._all) {
    throw new Error('opts.fieldMap for Resolver search() should be fieldMap of FieldsMapByElasticType type.');
  }

  if (!(sourceTC instanceof _graphqlCompose.ObjectTypeComposer)) {
    throw new Error('opts.sourceTC for Resolver search() should be instance of ObjectTypeComposer.');
  }

  const parser = new _ElasticApiParser.default({
    elasticClient: opts.elasticClient,
    prefix: opts.prefix
  });
  const searchITC = (0, _SearchBody.getSearchBodyITC)(opts).removeField(['size', 'from', '_source', 'explain', 'version']);
  const searchFC = parser.generateFieldConfig('search', {
    index: opts.elasticIndex,
    type: opts.elasticType
  });

  const argsConfigMap = _objectSpread({}, searchFC.args, {
    body: {
      type: searchITC
    }
  });

  delete argsConfigMap.index; // index can not be changed, it hardcoded in searchFC

  delete argsConfigMap.type; // type can not be changed, it hardcoded in searchFC

  delete argsConfigMap.explain; // added automatically if requested _shard, _node, _explanation

  delete argsConfigMap.version; // added automatically if requested _version

  delete argsConfigMap._source; // added automatically due projection

  delete argsConfigMap._sourceExclude; // added automatically due projection

  delete argsConfigMap._sourceInclude; // added automatically due projection

  delete argsConfigMap.trackScores; // added automatically due projection (is _scrore requested with sort)

  delete argsConfigMap.size;
  delete argsConfigMap.from;
  argsConfigMap.limit = 'Int';
  argsConfigMap.skip = 'Int';
  argsConfigMap.query = searchITC.getField('query');
  argsConfigMap.aggs = searchITC.getField('aggs');
  argsConfigMap.sort = searchITC.getField('sort');
  argsConfigMap.highlight = searchITC.getField('highlight');
  const topLevelArgs = ['q', 'query', 'sort', 'limit', 'skip', 'aggs', 'highlight', 'opts'];
  argsConfigMap.opts = schemaComposer.createInputTC({
    name: `${sourceTC.getTypeName()}Opts`,
    fields: _objectSpread({}, argsConfigMap)
  }).removeField(topLevelArgs);
  Object.keys(argsConfigMap).forEach(argKey => {
    if (topLevelArgs.indexOf(argKey) === -1) {
      // $FlowFixMe
      delete argsConfigMap[argKey];
    }
  });
  const type = (0, _SearchOutput.getSearchOutputTC)(opts);
  let hitsType;

  try {
    hitsType = type.get('hits.hits');
  } catch (e) {
    hitsType = 'JSON';
  }

  type.addFields({
    count: 'Int',
    max_score: 'Float',
    hits: hitsType ? [hitsType] : 'JSON'
  }).reorderFields(['hits', 'count', 'aggregations', 'max_score', 'took', 'timed_out', '_shards']);
  return schemaComposer.createResolver({
    type,
    name: 'search',
    kind: 'query',
    args: argsConfigMap,
    resolve: async rp => {
      let args = rp.args || {};
      const projection = rp.projection || {};
      if (!args.body) args.body = {};

      if ({}.hasOwnProperty.call(args, 'limit')) {
        args.size = args.limit;
        delete args.limit;
      }

      if ({}.hasOwnProperty.call(args, 'skip')) {
        args.from = args.skip;
        delete args.skip;
      }

      const {
        hits = {}
      } = projection;

      if (hits && typeof hits === 'object') {
        // Turn on explain if in projection requested this fields:
        if (hits._shard || hits._node || hits._explanation) {
          args.body.explain = true;
        }

        if (hits._version) {
          args.body.version = true;
        }

        if (!hits._source) {
          args.body._source = false;
        } else {
          args.body._source = toDottedList(hits._source);
        }

        if (hits._score) {
          args.body.track_scores = true;
        }
      }

      if (args.query) {
        args.body.query = args.query;
        delete args.query;
      }

      if (args.aggs) {
        args.body.aggs = args.aggs;
        delete args.aggs;
      }

      if (args.highlight) {
        args.body.highlight = args.highlight;
        delete args.highlight;
      }

      if (args.sort) {
        args.body.sort = args.sort;
        delete args.sort;
      }

      if (args.opts) {
        args = _objectSpread({}, args.opts, {}, args, {
          body: _objectSpread({}, args.opts.body, {}, args.body)
        });
        delete args.opts;
      }

      if (args.body) {
        args.body = (0, _SearchBody.prepareBodyInResolve)(args.body, fieldMap);
      }

      const res = await searchFC.resolve(rp.source, args, rp.context, rp.info);
      res.count = res.hits.total;
      res.max_score = res.hits.max_score;
      res.hits = res.hits.hits;
      return res;
    }
  }).reorderArgs(['q', 'query', 'sort', 'limit', 'skip', 'aggs']);
}

function toDottedList(projection, prev) {
  let result = [];
  Object.keys(projection).forEach(k => {
    if ((0, _graphqlCompose.isObject)(projection[k])) {
      const tmp = toDottedList(projection[k], prev ? [...prev, k] : [k]);

      if (Array.isArray(tmp)) {
        result = result.concat(tmp);
        return;
      }
    }

    if (prev) {
      result.push([...prev, k].join('.'));
    } else {
      result.push(k);
    }
  });
  return result.length > 0 ? result : true;
}