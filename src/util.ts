import SearchFormInput, { SearchQueryParams, SearchData } from './types/search'
import querySchema from '../common/validators/search-query'
import { CLOTHING_TYPES, CLOTHING_SIZES_FULL_NAMES_BY_ACRONYM, HEIGHT_UNITS, WEIGHT_UNITS, GENDERS_SHORT_TO_FULL, CLOTHING_GENDERS_SHORT_TO_FULL, QUERY_PARAM_TO_WEIGHT_UNITS, QUERY_PARAM_TO_HEIGHT_UNITS } from '../common/constants'

export const handleNumberChange = (formik, name, limit) => {
  return (e) => {
    const { value } = e.target
    if (!value || (value.trim().length <= limit && !isNaN(value))) {
      formik.setFieldValue(name, value)
    }
  }
}

export const buildSizingString = (article_size, article_waist, article_inseam, isFull) => {
  if (article_size !== null) return isFull ? CLOTHING_SIZES_FULL_NAMES_BY_ACRONYM[article_size.toUpperCase()]: article_size.toUpperCase()
  if (article_waist !== null && article_inseam !== null) return (article_waist + 'x' + article_inseam)
  if (article_waist !== null) return article_waist
  return 'No Size'
}

export const capFirst = (word) => {
  if (word && word[0]) {
    return word[0].toUpperCase() + word.substring(1)
  }
  return word
}

export const metresToFeetInches = (metres) => {
  const parsed = parseFloat(metres)
  if (isNaN(parsed)) return null

  const inches = metres * 39.3701
  const ft = Math.floor(inches / 12)
  const remainingInches = Math.floor(inches - ft * 12)

  return [ft, remainingInches]
}

export const convertSearchFormValuesToQueryParams = (values: SearchFormInput): SearchQueryParams => {
  const isBottomType = (values.articleType === CLOTHING_TYPES.PANTS) || (values.articleType === CLOTHING_TYPES.SHORTS)

  const searchQueryParams: SearchQueryParams = {
    query: values.query || null,
    page: values.page,
    article_gender: (values.articleGender && values.articleGender[0].toLowerCase()) || null,
    type: (values.articleType && values.articleType.toLowerCase()) || null,
    size: (!isBottomType && values.articleSize && values.articleSize.toLowerCase()) || null,
    waist: (isBottomType && values.articleWaist) || null,
    inseam: (isBottomType && values.articleInseam) || null,
    height_units: values.heightUnits || null,
    height_ft: values.heightFeet || null,
    height_in: values.heightInches || null,
    height_cm: values.heightCm || null,
    weight_units: values.weightUnits || null,
    weight_kgs: values.weightKgs || null,
    weight_lbs: values.weightLbs || null,
    gender: (values.gender && values.gender[0].toLowerCase()) || null
  }

  return searchQueryParams
}

// convert height to metres and return valid string
// if invalid input, or missing sufficient values, returns null
export const generateQueryHeight = (heightUnits, heightFeet, heightInches, heightCm): string => {
  let valid
  if (heightUnits === HEIGHT_UNITS.FT_IN) {
    if (!heightFeet && !heightInches) return null

    const parsedFeet = parseInt(heightFeet, 10)
    const parsedInches = parseInt(heightInches, 10)

    const validFeet = isNaN(parsedFeet) ? null : parsedFeet
    const validInches = isNaN(parsedInches) ? null : parsedInches

    let inches = 0
    if (validFeet) { inches += validFeet * 12 } 
    if (validInches) { inches += validInches }

    if (validFeet || validInches) valid = (inches / 39.37).toFixed(3)
  } else {
    if (!heightCm) return

    const parsed = parseInt(heightCm, 10)
    valid = isNaN(parsed) ? null : (parsed / 100).toFixed(3)
  }
  
  return valid
}

// convert weight to kg and return valid string
// if invalid input, returns null
export const generateQueryWeight = (weightUnits, weightLbs, weightKgs): string => {
  let valid = null

  if (weightUnits === WEIGHT_UNITS.LBS) {
    if (!isNaN(parseInt(weightLbs))) {
      valid = (0.45359237 * parseInt(weightLbs)).toFixed(3)
    }
  } else {
    if (!isNaN(parseInt(weightKgs))) {
      valid = parseInt(weightKgs).toFixed(3)
    }
  }

  return valid
}

export const convertQueryParamsToFormValues = (query: SearchQueryParams): SearchFormInput => {
  console.log('query before converting to form values:', query)
  if (querySchema.isValidSync(query)) {
    const heightUnits = QUERY_PARAM_TO_HEIGHT_UNITS[query.height_units] || HEIGHT_UNITS.FT_IN
    let heightFeet = ''
    let heightInches = ''
    let heightCm = ''
    if (heightUnits === HEIGHT_UNITS.FT_IN) {
      if (query.height_ft) heightFeet = query.height_ft
      if (query.height_in) heightInches = query.height_in
    } else {
      if (query.height_cm) heightCm = query.height_cm
    }

    const weightUnits = QUERY_PARAM_TO_WEIGHT_UNITS[query.weight_units] || WEIGHT_UNITS.LBS
    let weightLbs = ''
    let weightKgs = ''
    if (weightUnits === WEIGHT_UNITS.LBS) {
      if (query.weight_lbs) weightLbs = query.weight_lbs
    } else {
      if (query.weight_kgs) weightKgs = query.weight_kgs
    }

    return {
      query: query.query || '', 
      page: query.page,
      articleGender: CLOTHING_GENDERS_SHORT_TO_FULL[query.article_gender] || '',
      articleType: (query.type && (query.type[0].toUpperCase() + query.type.slice(1))) || '',
      articleSize: (query.size && query.size.toUpperCase()) || '',
      articleWaist: query.waist || '',
      articleInseam: query.inseam || '',
      heightUnits: heightUnits,
      heightFeet,
      heightInches,
      heightCm,
      weightUnits,
      weightLbs,
      weightKgs,
      gender: GENDERS_SHORT_TO_FULL[query.gender] || ''
    }
  } else {
    return {
      query: '', 
      page: '1',
      articleGender: '',
      articleType: '',
      articleSize: '',
      articleWaist: '',
      articleInseam: '',
      heightUnits: '',
      heightFeet: '',
      heightInches: '',
      heightCm: '',
      weightUnits: '',
      weightLbs: '',
      weightKgs: '',
      gender: '' 
    }
  }
}

export const convertQueryParamsToSearchData = (params: SearchQueryParams): SearchData => {
  const searchData: SearchData = {
    query: params.query,
    page: params.page,
    article_gender: params.article_gender,
    type: params.type,
    size: params.type,
    waist: params.waist,
    inseam: params.inseam,
    height: generateQueryHeight(params.height_units, params.height_ft, params.height_in, params.height_cm),
    weight: generateQueryWeight(params.weight_units, params.weight_lbs, params.weight_kgs),
    gender: params.gender
  }

  return searchData
}