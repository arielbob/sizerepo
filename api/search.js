const router = require('express').Router()
// const bluebird = require('bluebird')
require('dotenv').config()
const limiter15Mins = require('../common/util').limiter15Mins
const condenseWhitespace = require('condense-whitespace')
const { CLOTHING_TYPES } = require('../common/constants')

const es = require('./es')
const postsService = require('../services/posts')

const MAX_RESULTS_SIZE = 12

router.get('/', limiter15Mins(300), async (req, res, next) => {
  try {
    let {
      query,
      article_gender,
      type,
      size,
      waist,
      inseam,
      height,
      weight,
      gender
    } = req.query

    // page starts at 1
    const page = parseInt(req.query.page) || 1

    const clothing = {
      gender: article_gender,
      type,
      size,
      waist,
      inseam
    }
    const body = {
      height, weight, gender
    }

    // TODO: don't condense whitespace here, just do it client-side
    if (query) query = condenseWhitespace(query)
    for (let [k, v] of Object.entries(clothing)) {
      if (clothing[k]) clothing[k] = condenseWhitespace(v)
    }
    for (let [k, v] of Object.entries(body)) {
      if (body[k]) body[k] = condenseWhitespace(v)
    }

    const must = [
      { multi_match: { query: query || '', fields: ['brand', 'article_name'] } }
    ]

    const should = []
    // it's fine if we don't validate these since they're just strings
    if (clothing.gender) should.push({
      match: { article_gender: { query: clothing.gender } }
    })
    if (clothing.type) should.push({
      match: { article_type: { query: clothing.type } }
    })
    if (clothing.articleSize) should.push({
      match: { article_size: { query: clothing.size } }
    })
    if (clothing.type === CLOTHING_TYPES.PANTS || clothing.type === CLOTHING_TYPES.SHORTS) {
      if (clothing.waist && !isNaN(parseInt(clothing.waist))) should.push({
        function_score: {
          gauss: {
            article_waist: {
              origin: parseInt(clothing.waist),
              scale: 1,
              decay: 0.5
            }
          }
        }
      })
      if (clothing.inseam && !isNaN(parseInt(clothing.inseam))) should.push({
        function_score: {
          gauss: {
            article_inseam: {
              origin: parseInt(clothing.inseam),
              scale: 1,
              decay: 0.5
            }
          }
        }
      })
    } else {
      if (clothing.size) should.push({
        match: { article_size: { query: clothing.size } }
      })
    }
    if (clothing.height && !isNaN(parseFloat(clothing.height))) should.push({
      function_score: {
        gauss: {
          height_m: {
            origin: parseFloat(clothing.height),
            scale: 0.5,
            decay: 0.3
          }
        }
      }
    })
    if (body.weight && !isNaN(parseInt(body.weight))) should.push({
      function_score: {
        gauss: {
          height_m: {
            origin: parseFloat(body.weight),
            scale: 5,
            decay: 0.3
          }
        }
      }
    })
    if (body.gender) should.push({
      match: { gender: { query: body.gender } }
    })

    // we get MAX_RESULTS_SIZE + 1 to check if more results exist after the current page
    let searchResponse
    try {
      const offset = (page - 1) * MAX_RESULTS_SIZE
      searchResponse = await es.search({
        index: process.env.ES_INDEX,
        body: {
          from: offset,
          size: MAX_RESULTS_SIZE + 1,
          query: {
            bool: {
              must,
              should
            }
          }
        }
      })
    } catch (err) {
      console.error(err)
      const searchErr = new Error('Search failed')
      searchErr.status = 500
      return next(searchErr)
    }

    const results = searchResponse.body.hits.hits.map(r => ({
      id: r._id,
      data: r._source
    }))

    const hasPrev = page > 1
    const hasNext = results.length > MAX_RESULTS_SIZE
    if (hasNext) results.pop()

    return res.status(200).json({
      data: {
        results,
        page,
        hasPrev,
        hasNext
      }
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
