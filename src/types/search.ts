// interface for the search form fields
export default interface SearchFormInput {
  query: string, 
  page: string,
  articleGender: string,
  articleType: string,
  articleSize: string,
  articleWaist: string,
  articleInseam: string,
  heightUnits: string,
  heightFeet: string,
  heightInches: string,
  heightCm: string,
  weightUnits: string,
  weightLbs: string,
  weightKgs: string,
  gender: string 
}

// interface for /search url query parameters
export interface SearchQueryParams {
  query: string,
  page: string,
  article_gender: string,
  type: string,
  size: string,
  waist: string,
  inseam: string,
  height_units: string,
  height_ft: string,
  height_in: string,
  height_cm: string,
  weight_units: string,
  weight_lbs: string,
  weight_kgs: string,
  gender: string
}

// search api request data schema
export interface SearchData {
  query: string,
  page: string,
  article_gender: string,
  type: string,
  size: string,
  waist: string,
  inseam: string,
  height: string,
  weight: string,
  gender: string
}