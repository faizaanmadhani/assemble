const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
//GraphQL Dependancies
const {ApolloServer} = require('apollo-server-express');
const {ApiElasticSearchClient} = require('../../elasticsearch/server.elasticsearch');
const {bulk} = require('../../elasticsearch/server.es.bulk')
const madeExecutableSchema = require('./server.graphql');
const {generateMock} = require('../../querying/generate');

const PORT = 8080;

const server = new ApolloServer({
    schema: madeExecutableSchema,
    playground: true,
  });

//Use BodyParser as middleware to parse json
app.use(bodyParser.json())

// TODO Set port for the app to listen on
app.set('port', process.env.PORT || 3001);

// TODO Set path to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// TODO Enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method");
  next();
});

// Define the `/search` route that should return elastic search results
app.get('/graphql/search', generateMock);
app.get('/graphql/bulk', bulk);

server.applyMiddleware({app});

app.listen(PORT, function () {
  console.log(`Express server listening on port :${PORT}${server.graphqlPath}`);
});




// Define the `/search` route that should return elastic search results
