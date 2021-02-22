const {createMatches, mustSearch, shouldSearch, createQuery} = require("./queries")
const {ElasticSearchClient, ApiElasticSearchClient} = require("../elasticsearch/server.elasticsearch")

async function generateMock(req, res) {
    let questions = [];
    for(let i = 1; i <= 25; ++i) {
        let ran = Math.floor(Math.random() * 40);
        let query = createQuery(ran, 1, mustSearch(createMatches([{"number": i}])));
        let k = await ElasticSearchClient("amc12", query)
        questions.push(k['hits']);
    }
    res.send(questions);
}


module.exports = {
    generateMock
}