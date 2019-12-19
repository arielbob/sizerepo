import SearchFormInput, { SearchQueryParams } from './types/search'
import { CLOTHING_TYPES } from '../common/constants'

export const handleNumberChange = (formik, name, limit) => {
  return (e) => {
    const { value } = e.target
    if (!value || (value.trim().length <= limit && !isNaN(value))) {
      formik.setFieldValue(name, value)
    }
  }
}

export const buildSizingString = (article_size, article_waist, article_inseam) => {
  if (article_size !== null) return article_size.toUpperCase()
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
    page: 1,
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