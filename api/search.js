const router = require('express').Router()
// const bluebird = require('bluebird')
require('dotenv').config()
const condenseWhitespace = require('condense-whitespace')
const { CLOTHING_TYPES } = require('../common/constants')

const es = require('./es')
const postsService = require('../services/posts')

const MAX_RESULTS_SIZE = 10

const convertUnits = (body) => {
  // convert height to metres
  if (body.heightUnits === HEIGHT_UNITS.FT_IN) {
    const inches = parseInt(body.heightFeet, 10) * 12 + parseInt(body.heightInches)
    body.height = 0.0254 * inches
  } else {
    body.height = parseInt(body.heightCm) / 100
  }

  // convert weight to kgs
  if (body.weightUnits === WEIGHT_UNITS.LBS) {
    body.weight = 0.45359237 * body.weightLbs
  } else {
    body.weight = body.weightKgs
  }
}

// convert form values to db enum values
// TODO: make conversions explicit somewhere
const convertGenders = (clothing, body) => {
  clothing.gender = clothing.gender[0].toLowerCase()
  body.gender = body.gender[0].toLowerCase()
}

const convertArticleType = (clothing) => {
  clothing.type = clothing.type.toLowerCase()
}

const convertArticleSize = (clothing) => {
  if (clothing.size) {
    clothing.size = clothing.size.toLowerCase()
  }
}

const removeExtraneousData = (clothing) => {
  if (clothing.type === CLOTHING_TYPES.PANTS || clothing.type === CLOTHING_TYPES.SHORTS) {
    clothing.size = null
  } else {
    clothing.waist = null
    clothing.inseam = null
  }
}

router.get('/', async (req, res, next) => {
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
      gender,
      page
    } = req.query

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

    if (query) query = condenseWhitespace(query)
    for (let [k, v] of Object.entries(clothing)) {
      if (clothing[k]) clothing[k] = condenseWhitespace(v)
    }
    for (let [k, v] of Object.entries(body)) {
      if (body[k]) body[k] = condenseWhitespace(v)
    }
    console.log(req.query)
    console.log(query)

    console.log('clothing filter:', clothing)
    console.log('body filter:', body)

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

    let results
    try {
      results = await es.search({
        index: 'fitrepo',
        body: {
          from: parseInt(page) - 1 || 0,
          size: MAX_RESULTS_SIZE,
          query: {
            bool: {
              must, should
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

    return res.status(200).json({
      data: {
        results: results.hits.hits.map(r => ({
          id: r._id,
          data: r._source
        }))
      }
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
