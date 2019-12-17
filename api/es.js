const elasticsearch = require('elasticsearch')
require('dotenv').config()

const client = new elasticsearch.Client({
  hosts: [process.env.ES_HOST]
})

module.exports = client
