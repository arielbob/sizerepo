const yup = require('yup')

const ARTICLE_GENDER_PARAMS = ['m', 'w', 'u']
const ARTICLE_TYPE_PARAMS = ['shirt', 'pants', 'shorts', 'outerwear', 'knitwear', 'sweatshirt', 'other']
const ARTICLE_SIZE_PARAMS = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl']
const HEIGHT_UNITS_PARAMS = ['ft/in', 'cm']
const WEIGHT_UNITS_PARAMS = ['kgs', 'lbs']
const GENDER_PARAMS = ['m', 'f', 'o']

// modelled after SearchQueryParams interface
const schema = yup.object().shape({
  query: yup.string(),
  page: yup.number().integer().positive(),
  article_gender: yup.string().oneOf(ARTICLE_GENDER_PARAMS),
  type: yup.string().oneOf(ARTICLE_TYPE_PARAMS),
  size: yup.string().oneOf(ARTICLE_SIZE_PARAMS),
  waist: yup.number().integer().min(0).lessThan(100), 
  inseam: yup.number().integer().min(0).lessThan(100),
  height_units: yup.string().oneOf(HEIGHT_UNITS_PARAMS),
  height_ft: yup.number().min(0).lessThan(10),
  height_in: yup.number().min(0).lessThan(100),
  height_cm: yup.number().min(0).lessThan(1000),
  weight_units: yup.string().oneOf(WEIGHT_UNITS_PARAMS),
  weight_lbs: yup.number().min(0).lessThan(1000),
  weight_kgs: yup.number().min(0).lessThan(1000),
  gender: yup.string().oneOf(GENDER_PARAMS)
})

module.exports = schema