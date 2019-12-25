const router = require('express').Router()
const crypto = require('crypto')
const upload = require('multer')()
const sharp = require('sharp')
const mmm = require('mmmagic')
const Magic = mmm.Magic
const bluebird = require('bluebird')
const condenseWhitespace = require('condense-whitespace');
require('dotenv').config()

const { s3 } = require('./aws')
const es = require('./es')
const postsService = require('../services/posts')
const clothingValidator = require('../common/validators/clothing')
const bodyValidator = require('../common/validators/body')
const {
  HEIGHT_UNITS,
  WEIGHT_UNITS,
  ALL_ACCEPTED_FILETYPES,
  MAX_FILESIZE_BYTES,
  CLOTHING_TYPES
} = require('../common/constants')

bluebird.promisifyAll(Magic.prototype);

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

// NOTE: async methods require errors to be explicitly passed to error handler via next(err)
// i.e. thrown errors will not be caught by handler
// or just wrap it all in a try catch block, which is what i do
// NOTE: all the individual try and catch blocks might be unnecessary
router.post('/submit', upload.single('image'), async (req, res, next) => {
  try {
    const { file } = req
    // NOTE: this is form data, so it's all strings
    const clothing = JSON.parse(req.body.clothing)
    const body = JSON.parse(req.body.body)
    const { imageRotation } = req.body

    // form data validation
    const hasImage = !!file
    const clothingErrors = clothingValidator(clothing)
    const bodyErrors = bodyValidator(body)
    const hasErrors = isNaN(imageRotation) || !hasImage || Object.keys(clothingErrors).length || Object.keys(bodyErrors).length

    console.log(clothingErrors)
    console.log(bodyErrors)
    console.log('file data: ', file)

    if (hasErrors) {
      const err = new Error('Invalid input')
      err.status = 400
      return next(err)
    }

    console.log('clothing before', clothing)

    for (let [k, v] of Object.entries(clothing)) {
      clothing[k] = condenseWhitespace(v)
    }
    for (let [k, v] of Object.entries(body)) {
      body[k] = condenseWhitespace(v)
    }
    // NOTE: do this first since the values from the input are the ones in the constants and we use those constants
    // in this function. if we convert the types before, the types in this function won't match when they should
    removeExtraneousData(clothing)
    // convert form data to useable input for posts service
    convertUnits(body)
    convertGenders(clothing, body)
    convertArticleType(clothing)
    convertArticleSize(clothing)

    console.log('clothing', clothing)
    console.log('body', body)

    // detect and verify types
    const magic = new Magic(mmm.MAGIC_MIME_TYPE)
    let mimeType
    try {
      mimeType = await magic.detectAsync(file.buffer)
    } catch (err) {
      return next(err)
    }

    console.log(mimeType)
    const mimeData = mimeType.split('/')
    const filetype = mimeData[1]
    if (!ALL_ACCEPTED_FILETYPES.has(filetype)) {
      const fileErr = new Error('Please upload either a PNG or JPEG image')
      fileErr.status = 400
      return next(fileErr)
    }

    // we check file size before generating the final buffer, to save some more space
    // (sharp also does some compression)
    if (Buffer.byteLength(file.buffer) > MAX_FILESIZE_BYTES) {
      const fileErr = new Error('Please upload an image less than 5 MB')
      fileErr.status = 400
      return next(fileErr)
    }

    // create final image buffer by applying rotations
    // toBuffer also removes all EXIF data
    let finalImageBuffer
    try {
      finalImageBuffer = await sharp(file.buffer)
        .rotate(parseInt(imageRotation, 10) * 90)
        .toBuffer()
    } catch (err) {
      return next(err)
    }

    // generate the hash of the final image buffer
    const hash = crypto.createHash('md5').update(finalImageBuffer).digest('hex')
    console.log(hash)

    // upload to s3
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: hash + '.' + filetype,
      Body: finalImageBuffer,
      ContentType: mimeType
    }
    let s3Object
    try {
      s3Object = await s3.upload(s3Params).promise()
      console.log('uploaded at', s3Object.Location)
    } catch (err) {
      return next(err)
    }

    const postDocument = {
      brand: clothing.brand,
      article_name: clothing.name,
      article_gender: clothing.gender,
      article_type: clothing.type,
      article_size: clothing.size,
      article_waist: clothing.waist,
      article_inseam: clothing.inseam,
      height_m: body.height,
      weight_kg: body.weight,
      gender: body.gender,
      image_url: s3Object.Location
    }

    // add post to database
    let postId
    try {
      postId = await postsService.create(postDocument)
    } catch(err) {
      return next(err)
    }

    return res.status(200).json({
      message: 'Post created',
      data: { id: postId }
    })
  } catch (err) {
    next(err)
  }
})

router.get('/', (req, res, next) => {
  const RECENT_POSTS_LIMIT = 5
  postsService.getPosts(RECENT_POSTS_LIMIT)
    .then(posts => {
      res.status(200).json({
        data: {
          posts
        }
      })
    })
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
  postsService.getPostById(req.params.id)
    .then(post => {
      if (!post) {
        const err = new Error('Post not found')
        err.status = 404
        return next(err)
      }

      console.log(post)
      res.status(200).json({
        data: post
      })
    })
    .catch(err => next(err))
})

module.exports = router
