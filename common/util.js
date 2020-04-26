const rateLimit = require('express-rate-limit')

exports.metresToFeetString = (metres) => {
  const inches = parseFloat(metres) * 39.37
  let feet = Math.floor(inches / 12)
  let remainingInches = Math.round(inches - feet * 12)

  if (remainingInches === 12) {
    feet++
    remainingInches = 0
  }

  return feet.toString() + '\'' + remainingInches.toString() + '"'
}

exports.metresToCmString = (metres) => {
  return (parseFloat(metres) * 100).toFixed(2).toString() + 'cm'
}

exports.kgsToLbsString = (kgs) => {
  const weightLbs = Math.round(parseFloat(kgs) * 2.20462)
  return weightLbs.toString() + ' lbs'
}

exports.kgsToKgsString = (kgs) => {
  const roundedKgs = Math.round(kgs)
  return roundedKgs.toString() + ' kgs'
}

// create limiter middleware for 15 minute window
exports.limiter15Mins = (max) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: max,
    handler: (req, res, next) => {
      const error = new Error('Too many requests, please try again later.')
      error.status = 429
      next(error)
    }
  })
}