const client = require('./server.client')
const params = require('./json/es-settings-mapping.json')

client.indices.create(
    {
        index: "amc12",
        body: params
    },
    (error, response, status) => {
        if (!error) {
            console.info("Created a New Index!");
            console.info(response);
            console.info(status);
            console.info('\n')
        } else {
            console.info(error);
        }
    }
);