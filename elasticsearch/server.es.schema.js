const retrieve_all = {
    "size": 1000,
    "from": 0,
    "query": {
      "match_all": {}
    }
  };

function getYear(year) {
  return {
    "query": {
      "terms": {
      "year": year
      
      }
    }
  }
}