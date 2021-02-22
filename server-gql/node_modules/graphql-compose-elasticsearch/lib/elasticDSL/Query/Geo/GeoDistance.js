"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoDistanceITC = getGeoDistanceITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

var _Geo = require("../../Commons/Geo");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getGeoDistanceITC(opts) {
  const name = (0, _utils.getTypeName)('QueryGeoDistance', opts);
  const description = (0, _utils.desc)(`
    Filters documents that include only hits that exists within
    a specific distance from a geo point.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryGeoDistanceSettings', opts);
  const fields = (0, _FieldNames.getGeoPointAsFieldConfigMap)(opts, opts.getOrCreateITC(subName, () => ({
    name: subName,
    fields: {
      top_left: (0, _Geo.getGeoPointFC)(opts),
      bottom_right: (0, _Geo.getGeoPointFC)(opts)
    }
  })));

  if (typeof fields === 'object') {
    return opts.getOrCreateITC(name, () => ({
      name,
      description,
      fields: _objectSpread({
        distance: {
          type: 'String!',
          description: 'Eg. 12km'
        },
        distance_type: (0, _Geo.getDistanceCalculationModeFC)(opts)
      }, fields, {
        validation_method: 'String'
      })
    }));
  }

  return {
    type: 'JSON',
    description
  };
}