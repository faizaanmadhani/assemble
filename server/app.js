const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const port = 3000

const {ApiElasticSearchClient} = require('./elasticsearch/server.elasticsearch.js')

//Use BodyParser as middleware to parse json
app.use(bodyParser.json())

// TODO Set port for the app to listen on
app.set('port', port);

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
app.get('/search', ApiElasticSearchClient);

app.listen(port, function () {
    console.log(`App listening on port :3000`);
  });
  
  
  
  
  // Define the `/search` route that should return elastic search results
  app.get('/search', ApiElasticSearchClient);