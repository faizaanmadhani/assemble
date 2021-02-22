// create matches from array indices from body
function createMatches(body) {
    let matches = [];
    for(let param of body) {
        matches.push({"match": param });
    }

    return matches;
}

// search for entries which match parameters in body
// (body will be an array of parameters - parameters being in the form of objects, eg. {"year": 2002})
function mustSearch(matches) {
    return {
        "bool": {
            "must": matches
        }
    }
}

// search for entries which match any of the params in body
// (body will be an array of parameters - parameters being in the form of objects, eg. {"year": 2002})
function shouldSearch(matches) {
    return {
        "bool": {
            "should": matches
        }
    }
}

// create queries using createMatches, mustSearch, and shouldSearch
function createQuery(start, number, query) {
    const q = {
        "query":
            query
    }

    return q;
}

module.exports = {
    createMatches,
    mustSearch,
    shouldSearch,
    createQuery
}
