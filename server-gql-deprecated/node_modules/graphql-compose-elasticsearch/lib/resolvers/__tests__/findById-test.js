"use strict";

var _graphqlCompose = require("graphql-compose");

var _findById = _interopRequireDefault(require("../findById"));

var _elasticClient = _interopRequireDefault(require("../../__mocks__/elasticClient"));

var _cv = require("../../__mocks__/cv");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const findByIdResolver = (0, _findById.default)((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, {
  sourceTC: _cv.CvTC,
  fieldMap: _cv.CvFieldMap,
  elasticClient: _elasticClient.default,
  elasticIndex: 'cv',
  elasticType: 'cv'
}));
beforeEach(() => {
  _graphqlCompose.schemaComposer.clear();
});
describe('findById', () => {
  it('return instance of Resolver', () => {
    expect(findByIdResolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  it('check args', () => {
    expect(findByIdResolver.hasArg('id')).toBeTruthy();
  });
  it('resolve', async () => {
    await findByIdResolver.resolve({
      args: {
        id: '4554'
      },
      context: {
        elasticClient: _elasticClient.default
      }
    }).then(res => {
      console.log(res); // eslint-disable-line
    }).catch(e => {
      expect(e).toMatchObject({
        message: /unknown error/
      });
    });
  });
});