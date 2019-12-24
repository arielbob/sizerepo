const es = require('../api/es')
const db = require('../api/db')
require('dotenv').config()

const bulkIndexPosts = async () => {
  try {
    const posts = await db.any(`
      SELECT
        id,
        brand,
        article_name,
        article_gender,
        article_type,
        article_size,
        article_waist,
        article_inseam,
        height_m,
        weight_kg,
        gender,
        image_url
      FROM posts
      WHERE is_indexed=false
    `)

    if (!posts.length) {
      console.log('no posts to index')
      return
    }

    const bodyPairs = []
    posts.forEach(post => {
      // bulk operation accepts a newline delimited json body, so we create an array
      // of operation + source tuples and then flatten it
      bodyPairs.push([
        { index: { _index: process.env.ES_INDEX, _id: post.id } },
        post
      ])
    })

    const body = bodyPairs.flat()
    // i'm not sure if this will actually log errors or just throw and move
    // execution to catch block...
    const { body: response } = await es.bulk({ body })

    if (!response.errors) {
      const ids = []

      // we do this generally, i.e. not just for index operations since other
      // operations may need to be handled in bulk indexing in the future
      response.items.forEach(action => {
        // we don't need to check for errors since we check response.errors
        const operation = Object.keys(action)[0]
        ids.push(action[operation]._id)
      })

      await db.none('UPDATE posts SET is_indexed=true WHERE id IN ($1:csv)', [ids])
      console.log(response.items.length, 'documents indexed')
    } else {
      const erroredDocuments = []

      response.items.forEach((action, i) => {
        const operation = Object.keys(action)[0]

        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: body[i * 2],
            document: body[i * 2 + 1]
          })
        }
      })
      
      console.error(erroredDocuments)
    }
  } catch(error) {
    console.error(error)
  }
}

bulkIndexPosts()