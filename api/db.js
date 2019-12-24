require('dotenv').config()
const pgp = require('pg-promise')()

const cn = {
  host: process.env.DB_DEV_HOST,
  port: process.env.DB_DEV_PORT,
  database: process.env.DB_DEV_DB,
  user: process.env.DB_DEV_USER,
  password: process.env.DB_DEV_PASS
}

const db = pgp(cn)

module.exports = db
