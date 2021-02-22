const _ = require('lodash');
const client = require('./server.client');

//Test Bulk Data
const DATA = require('../server-gql/src/json/amc12.json').amc12;

/**
 * Generate bulk schema
 */
function createBulk() {
  let initialBulk = {index: {_index: "amc12"}};
  let collectionBulk = [];
  _.map(_.keys(DATA), uuid => {
    collectionBulk = [
      ...collectionBulk, 
      initialBulk, 
      DATA[uuid]
    ];
  });

  client.bulk({body: collectionBulk}, function (err, r) {
    if (err) {
      console.log(`Failed Bulk operation\n`, err);
    } else {
      console.log(`Successfully imported ${_.keys(DATA).length} items \n`);
    }
  });

  return client.search({index: "amc12", body: {}});
}


module.exports = {
  bulk: createBulk
}