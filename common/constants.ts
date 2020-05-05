const isProd = process.env.NODE_ENV.trim() === 'production'

export const API_URL = isProd ? '' : 'http://localhost:3000'

export enum UNITS {
  METRIC = 'Metric',
  IMPERIAL = 'Imperial'
}

export const CLOTHING_TYPES = {
  SHIRT: 'Shirt',
  PANTS: 'Pants',
  SHORTS: 'Shorts',
  JACKET: 'Jacket',
  OUTERWEAR: 'Outerwear',
  KNITWEAR: 'Knitwear',
  SWEATSHIRT: 'Sweatshirt',
  OTHER: 'Other'
}

export const CLOTHING_GENDERS = {
  MENS: 'Men\'s',
  WOMENS: 'Women\'s',
  UNISEX: 'Unisex'
}

export const CLOTHING_SIZES = {
  XXS: 'XXS',
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL'
}

export const CLOTHING_SIZES_FULL_NAMES_BY_ACRONYM = {
  XXS: 'Extra-Extra-Small',
  XS: 'Extra-Small',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  XL: 'Extra-Large',
  XXL: 'Extra-Extra-Large'
}

export const GENDERS = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
}

export const HEIGHT_UNITS = {
  FT_IN: 'ft/in',
  CM: 'cm'
}

export const QUERY_PARAM_TO_HEIGHT_UNITS = {
  'ft/in': this.HEIGHT_UNITS.FT_IN,
  cm: this.HEIGHT_UNITS.CM
}

export const WEIGHT_UNITS = {
  LBS: 'lbs',
  KGS: 'kgs'
}

export const QUERY_PARAM_TO_WEIGHT_UNITS = {
  lbs: this.WEIGHT_UNITS.LBS,
  kgs: this.WEIGHT_UNITS.KGS
}

export const ACCEPTED_FILETYPES = 'image/png, image/jpeg'

export const ALL_ACCEPTED_FILETYPES = new Set([
  'png', 'jfif', 'pjpeg', 'jpeg', 'pjp', 'jpg'
])

export const MAX_FILESIZE_BYTES = 5000000

export const CLOTHING_GENDERS_SHORT_TO_FULL = {
  m: 'Men\'s',
  w: 'Women\'s',
  u: 'Unisex'
}

export const GENDERS_SHORT_TO_FULL = {
  m: 'Male',
  f: 'Female',
  o: 'Other'
}

// keys that are the same for the db, elasticsearch, and form inputs
export const POST_KEYS = {
  BRAND: 'brand',
  ARTICLE_NAME: 'article_name',
  ARTICLE_GENDER: 'article_gender',
  ARTICLE_TYPE: 'article_type',
  ARTICLE_SIZE: 'article_size',
  ARTICLE_WAIST: 'article_waist',
  ARTICLE_INSEAM: 'article_inseam',
  HEIGHT_M: 'height_m',
  WEIGHT_KG: 'weight_kg',
  GENDER: 'gender'
}
