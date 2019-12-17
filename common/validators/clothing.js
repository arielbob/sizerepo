const { CLOTHING_TYPES, CLOTHING_GENDERS, CLOTHING_SIZES } = require('../constants')

const validate = (values) => {
  const errors = {}

  if (!values.name || !values.name.trim().length) {
    errors.name = 'Required'
  } else if (values.name.trim().length > 100) {
    errors.name = 'Please enter a name less than or equal to 100 characters'
  }

  if (!values.brand || !values.brand.trim().length) {
    errors.brand = 'Required'
  } else if (values.brand.trim().length >= 100) {
    errors.brand = 'Please enter a brand name less than or equal to 100 characters'
  }

  if (!Object.values(CLOTHING_GENDERS).includes(values.gender)) errors.articleGender = 'Required'

  if (values.type === CLOTHING_TYPES.PANTS || values.type === CLOTHING_TYPES.SHORTS) {
    if (!values.waist.trim().length) {
      errors.waist = 'Required'
    } else if (values.waist < 0) {
      errors.waist = 'Waist size must be a number greater than or equal to zero'
    } else if (isNaN(values.waist)) {
      errors.waist = 'Waist size must be a number'
    }

    if (values.inseam < 0) {
      errors.inseam = 'Inseam size must be a number greater than or equal to zero'
    } else if (isNaN(values.inseam)) {
      errors.inseam = 'Inseam size must be a number'
    }
  } else {
    if (!Object.values(CLOTHING_TYPES).includes(values.type)) errors.type = 'Required'
    if (!Object.values(CLOTHING_SIZES).includes(values.size)) errors.size = 'Required'
  }

  return errors
}

module.exports = validate
