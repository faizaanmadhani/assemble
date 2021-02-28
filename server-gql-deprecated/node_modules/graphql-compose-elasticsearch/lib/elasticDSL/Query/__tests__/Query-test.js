"use strict";

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

const {
  printSchema
} = _graphqlCompose.graphql;
beforeEach(() => {
  _graphqlCompose.schemaComposer.clear();
});
describe('AGGS args converter', () => {
  it('Query DSL', () => {
    _graphqlCompose.schemaComposer.Query.addFields({
      search: {
        args: {
          body: {
            type: (0, _Query.getQueryITC)((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, {
              prefix: 'Elastic_',
              postfix: '_50'
            }))
          }
        },
        type: 'Int'
      }
    });

    const schema = _graphqlCompose.schemaComposer.buildSchema();

    expect(printSchema(schema)).toMatchSnapshot();
  });
});