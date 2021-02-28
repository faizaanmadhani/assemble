const client = require('../../elasticsearch/server.client')

client.indices.delete(
    {
        index: "catalog"
    },
    (error, response, status) => {
        if(!error) {
            console.info("Deleted Index!");
            console.info(response)
        } else {
            console.info(error)
        }
    }
);