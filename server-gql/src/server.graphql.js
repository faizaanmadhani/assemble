const { ElasticSearchClient } = require('../../elasticsearch/server.elasticsearch');
const elasticSearchSchema = require('../../elasticsearch//server.es.schema');
const { makeExecutableSchema } = require('graphql-tools');

//Construct a schema, using GraphQL schema language.
const typeDefs = `
  type Question {
    year: Int
    number: Int
    paper: String
    problem: String
    solution: String
    tags: [String]

  }
  type amc10 {
    question: Question
  }
  type amc12 {
    question: Question
  }
  type Query {
    amc10: [Question]
    amc12: [Question]
  }
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
    Query: {
      amc10: () => new Promise((resolve, reject) => {
        ElasticSearchClient("amc10", {...elasticSearchSchema})
          .then(r => {
            let _source = r['hits']['hits'];
                _source.map((item, i) => _source[i] = item._source);
  
            resolve(_source);
          });
      }),
      amc12: () => new Promise((resolve, reject) => {
        ElasticSearchClient("amc12", {...elasticSearchSchema})
          .then(r => {
            let _source = r['hits']['hits'];
                _source.map((item, i) => _source[i] = item._source);
  
            resolve(_source);
          });
      }),
    }
  };

  module.exports = makeExecutableSchema({
    "typeDefs": [typeDefs],
    "resolvers": resolvers
  });
  