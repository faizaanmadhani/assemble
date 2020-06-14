const client = require("./server.client");

//Ping the client to know if elasticsearch is up
client.ping({
    requestTimeout: 30000,
}, function(error) {
    error
    ? console.error('ElasticSearch cluster is down!')
    : console.log('ElasticSearch is ok');
});

function ElasticSearchClient(index, body) {
    //Perform the search by passing in the index, search query and type
    return client.search({index: index, body: body});
}

function ApiElasticSearchClient(req, res) {
    // perform the actual search passing in the index, the search query and the type
    ElasticSearchClient({...elasticSearchSchema})
      .then(r => res.send(r['hits']['hits']))
      .catch(e => {
        console.error(e);
        res.send([]);
      });
  }

  module.exports = {
      ApiElasticSearchClient,
      ElasticSearchClient
  };

