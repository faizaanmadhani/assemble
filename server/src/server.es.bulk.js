const _ = require('lodash');
const client = require('./server.client');

//Test Bulk Data
const PRODUCTS = require('./json/books.json').products;

/**
 * Generate bulk schema
 */
let initialBulk = {index: {_index: "catalog"}};
let collectionBulk = [];
_.map(_.keys(PRODUCTS), uuid => {
  collectionBulk = [
    ...collectionBulk, 
    initialBulk, 
    PRODUCTS[uuid]
  ];
});

client.bulk({body: collectionBulk}, function (err, r) {
  if (err) {
    console.log(`Failed Bulk operation\n`, err);
  } else {
    console.log(`Successfully imported ${_.keys(PRODUCTS).length} items \n`);
  }
});

