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
