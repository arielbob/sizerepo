// require('dotenv').config()

const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const limiter15Mins = require('./common/util').limiter15Mins
// const session = require('express-session')
// const passport = require('passport')

const apiRoutes = require('./api/routes')
const isProd = process.env.NODE_ENV.trim() === 'production'
const app = express()

console.log(process.env.NODE_ENV)

// this isn't really necessary since nginx we set the Host header to the original host in nginx,
// but we set it just in case X-Forwarded-Host is the only header available
// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true)

app.use(helmet())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true } ))
app.use(bodyParser.json())

const whitelist = isProd ? ['http://sizerepo.com', 'https://sizerepo.com'] : ['http://localhost:3000', 'http://localhost:8080']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      const error = new Error('Not allowed by CORS')
      error.status = 400
      callback(error)
    }
  }
}
app.use(cors(corsOptions))

if (isProd) app.use(express.static('dist'))

app.use('/api', limiter15Mins(500), apiRoutes)

app.use((req, res, next) => {
  res.format({
    'text/html': () => {
      res.sendFile(path.join(__dirname, 'dist/index.html'))
    },
    'application/json': () => {
      res.json({ message: 'Not found' })
    }
  })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status ? err.status : 500)

  res.format({
    'text/html': () => {
      if (!err.status || err.status >= 500) res.send('Something bad happened...')
      else res.send('Error ' + err.status)
    },
    'application/json': () => {
      if (!err.status || err.status >= 500) res.json({ message: 'Something bad happened...' })
      else res.json({ message: err.message })
    }
  })
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
