"use strict";

var _graphqlCompose = require("graphql-compose");

var Search = _interopRequireWildcard(require("../search"));

var _elasticClient = _interopRequireDefault(require("../../__mocks__/elasticClient"));

var _cv = require("../../__mocks__/cv");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const opts = (0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, {
  sourceTC: _cv.CvTC,
  fieldMap: _cv.CvFieldMap,
  elasticClient: _elasticClient.default,
  elasticIndex: 'cv',
  elasticType: 'cv'
});
beforeEach(() => {
  _graphqlCompose.schemaComposer.clear();
});
describe('search resolver', () => {
  it('should return Resolver', () => {
    expect((0, Search.default)(opts)).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('helper methods', () => {
    it('toDottedList()', () => {
      expect(Search.toDottedList({
        a: {
          b: true,
          c: {
            e: true
          }
        },
        d: true
      })).toEqual(['a.b', 'a.c.e', 'd']);
      expect(Search.toDottedList({})).toEqual(true);
    });
  });
});