"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNestedITC = getNestedITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getNestedITC(opts) {
  const name = (0, _utils.getTypeName)('AggsNested', opts);
  const description = (0, _utils.desc)(`
    A special single bucket aggregation that enables aggregating nested documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-nested-aggregation.html)
  `);
  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      path: 'String'
    }
  }));
}