const AWS = require('aws-sdk')

exports.s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  apiVersion: '2006-03-01'
})
