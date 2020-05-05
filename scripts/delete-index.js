const client = require('../api/es')
const db = require('../api/db')
require('dotenv').config()

client.indices.delete({
  index: process.env.ES_INDEX
}, (err, res, status) => {
  if (err) console.error(err)
  else {
    console.log(res)
    db.none('UPDATE posts SET is_indexed=false')
      .then(() => console.log('index deleted'))
      .catch(err => console.error(err))
  }
})
