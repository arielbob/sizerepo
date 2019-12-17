const router = require('express').Router()
const postsRoutes = require('./posts')
const searchRoutes = require('./search')

router.use('/posts', postsRoutes)
router.use('/search', searchRoutes)

module.exports = router
