const client = require('../api/es')
require('dotenv').config()

const init = async () => {
  // ping server to make sure it's running
  console.log('pinging')
  await client.ping({
    requestTimeout: 5000,
  })
    .then(res => console.log('OK'))
    .catch(err => console.error('elasticsearch not working!'))
  console.log()

  // create index
  console.log('creating index')
  await client.indices.create({
    index: process.env.ES_INDEX
  })
    .then(res => console.log('created index:', res))
    .catch(console.error)
  console.log()

  // define mappings
  console.log('defining mappings')
  await client.indices.putMapping({
    index: process.env.ES_INDEX,
    body: {
      properties: {
        brand: { type: 'text' },
        article_name: { type: 'text' },
        article_gender: { type: 'keyword' },
        article_type: { type: 'keyword' },
        article_size: { type: 'keyword' },
        article_waist: { type: 'byte' },
        article_inseam: { type: 'byte' },
        height_m: { type: 'float' },
        weight_kg: { type: 'float' },
        gender: { type: 'keyword' }
      }
    }
  })
    .then(res => console.log('created mapping:', res))
    .catch(console.error)
  console.log()

  // display mappings
  console.log('getting mappings')
  client.indices.getMapping({
    index: process.env.ES_INDEX
  })
    .then(res => console.log('mappings:', res.fitrepo.mappings.properties))
    .catch(console.error)
}

init()
