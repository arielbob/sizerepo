const client = require('../api/es')
const util = require('util')
require('dotenv').config()

const init = async () => {
  // ping server to make sure it's running
  console.log('pinging')
  await client.ping()
    .then(res => console.log('OK'))
    .catch(err => console.error('elasticsearch not working!'))
  console.log()

  const createBody = {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        brand: { type: 'text' },
        article_name: { type: 'text' },
        article_gender: { type: 'keyword' },
        article_type: { type: 'keyword' },
        article_size: { type: 'keyword' },
        article_waist: { type: 'byte' },
        article_inseam: { type: 'byte' },
        height_m: { type: 'float' },
        weight_kg: { type: 'float' },
        gender: { type: 'keyword' },
        image_url: { type: 'text', index: false }
      }
    },
    settings: {
      "analysis": {
        "analyzer": {
          "default": {
            "tokenizer": "standard",
            "char_filter": [
              "replace_dashes_with_dots"
            ],
            "filter": [
              "lowercase", "acronym_multiplexer"
            ]
          }
        },
        "char_filter": {
          "replace_dashes_with_dots": {
            "type": "pattern_replace",
            "pattern": "\\-",
            "replacement": "."
          }
        },
        "filter": {
          "acronym_multiplexer": {
            "type": "multiplexer",
            "filters": ["remove_dots", "word_delimiter_graph"]
          },
          "remove_dots": {
            "type": "pattern_replace",
            "pattern": "\\.",
            "replacement": ""
          }
        }
      }
    }
  }

  // create index
  console.log('creating index')
  await client.indices.create({
    index: process.env.ES_INDEX,
    body: createBody
  })
    .then(res => console.log('created index:', res))
    .catch(console.error)
  console.log()

  // display mappings
  console.log('index mappings:')
  await client.indices.getMapping({
    index: process.env.ES_INDEX
  })
    .then(res => console.log(res.body[process.env.ES_INDEX].mappings.properties))
    .catch(console.error)

  // display settings
  console.log('index settings:')
  client.indices.getSettings({
    index: process.env.ES_INDEX
  })
    .then(res => console.log(util.inspect(res.body[process.env.ES_INDEX].settings, {
      depth: 5
    })))
    .catch(console.error)
}

init()
