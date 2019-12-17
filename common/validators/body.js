const { GENDERS, HEIGHT_UNITS, WEIGHT_UNITS } = require('../constants')

const validate = (values) => {
  const errors = {}
  if (!Object.values(HEIGHT_UNITS).includes(values.heightUnits)) errors.type = 'Required'
  if (!Object.values(WEIGHT_UNITS).includes(values.weightUnits)) errors.size = 'Required'
  if (values.heightUnits === HEIGHT_UNITS.FT_IN) {
    // feet validation
    if (!values.heightFeet.trim().length) {
      errors.heightFeet = 'Required'
    } else if (values.heightFeet <= 0) {
      errors.heightFeet = 'Height must be greater than zero'
    } else if (isNaN(values.heightFeet)) {
      errors.heightFeet = 'Height must be a number'
    }
    // inches validation
    if (!values.heightInches.trim().length) {
      errors.heightInches = 'Required'
    } else if (values.heightInches < 0) {
      errors.heightInches = 'Value must be greater than or equal to zero'
    } else if (values.heightInches < 0 || values.heightInches >= 12) {
      errors.heightInches = 'Value must be between 0 and 12 (exclusive)'
    } else if (isNaN(values.heightInches)) {
      errors.heightInches = 'Height must be a number'
    }
  } else if (values.heightUnits === HEIGHT_UNITS.CM) {
    if (!values.heightCm.trim().length) {
      errors.heightCm = 'Required'
    } else if (values.heightCm <= 0) {
      errors.heightCm = 'Height must be greater than zero'
    } else if (isNaN(values.heightCm)) {
      errors.heightCm = 'Height must be a number'
    }
  }

  if (values.weightUnits === WEIGHT_UNITS.LBS) {
    if (!values.weightLbs.trim().length) {
      errors.weightLbs = 'Required'
    } else if (values.weightLbs <= 0) {
      errors.weightLbs = 'Weight must be greater than zero'
    } else if (isNaN(values.weightLbs)) {
      errors.weightLbs = 'Weight must be a number'
    }
  } else if (values.weightUnits === WEIGHT_UNITS.KGS) {
    if (!values.weightKgs.trim().length) {
      errors.weightKgs = 'Required'
    } else if (values.weightKgs <= 0) {
      errors.weightKgs = 'Weight must be greater than zero'
    } else if (isNaN(values.weightKgs)) {
      errors.weightKgs = 'Weight must be a number'
    }
  }
  return errors
}

module.exports = validate
