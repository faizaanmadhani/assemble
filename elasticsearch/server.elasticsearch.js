const client = require("./server.client");
const {createMatches, mustSearch, shouldSearch, createQuery} = require("../querying/queries")

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

function ApiElasticSearchClient(query, res) {
    // perform the actual search passing in the index, the search query and the type
    let match1 = createMatches([{"paper": "A"}, {"number": 4}]);
    let match2 = createMatches([{"year": 2003}, {"year": 2004}, {"year": 2005}, {"year": 2006}]);
    match1.push(shouldSearch(match2));

    ElasticSearchClient("amc12", query)
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

