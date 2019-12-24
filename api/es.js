const { Client } = require('@elastic/elasticsearch')
require('dotenv').config()

const client = new Client({
  node: process.env.ES_HOST
})

module.exports = client
