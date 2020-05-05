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
              "replace_extras_with_dots"
            ],
            "filter": [
              "lowercase", "synonyms", "acronym_multiplexer"
            ]
          }
        },
        "char_filter": {
          // turns h&m and t-shirt to h.m and t.shirt, respectively, so that they don't get deleted by the standard tokenizer
          // so that later we can create the tokens 'hm' and 'tshirt' (remove_inner_extras) and ['h', 'm'] and ['t', 'shirt'] (word_delimiter_graph)
          "replace_extras_with_dots": {
            "type": "pattern_replace",
            "pattern": "\\-|\\&",
            "replacement": "."
          }
        },
        "filter": {
          "acronym_multiplexer": {
            "type": "multiplexer",
            "filters": ["remove_inner_extras", "word_delimiter_graph"],
            // we don't need the original since searches using match will also go through this analyzer, thus the original will never be matched
            "preserve_original": false
          },
          "remove_inner_extras": {
            "type": "pattern_replace",
            "pattern": "\\.",
            "replacement": ""
          },
          "synonyms": {
            "type": "synonym",
            // TODO: replace with file with synonyms
            "synonyms": ["jcrew => j.crew"]
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
