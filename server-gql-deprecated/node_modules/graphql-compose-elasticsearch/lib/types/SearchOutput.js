"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchOutputTC = getSearchOutputTC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../utils");

var _Shards = _interopRequireDefault(require("./Shards"));

var _SearchHitItem = require("./SearchHitItem");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSearchOutputTC(opts) {
  const name = (0, _utils.getTypeName)('SearchOutput', opts);
  const nameHits = (0, _utils.getTypeName)('SearchHits', opts);
  return opts.getOrCreateOTC(name, () => ({
    name,
    fields: {
      took: 'Int',
      timed_out: 'Boolean',
      _shards: (0, _Shards.default)(opts),
      hits: opts.getOrCreateOTC(nameHits, () => ({
        name: nameHits,
        fields: {
          total: 'Int',
          max_score: 'Float',
          hits: [(0, _SearchHitItem.getSearchHitItemTC)(opts)]
        }
      })),
      aggregations: 'JSON'
    }
  }));
}