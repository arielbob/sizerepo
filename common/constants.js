exports.CLOTHING_TYPES = {
  SHIRT: 'Shirt',
  PANTS: 'Pants',
  SHORTS: 'Shorts',
  OUTERWEAR: 'Outerwear',
  KNITWEAR: 'Knitwear',
  SWEATSHIRT: 'Sweatshirt',
  OTHER: 'Other'
}

exports.CLOTHING_GENDERS = {
  MENS: 'Men\'s',
  WOMENS: 'Women\'s',
  UNISEX: 'Unisex'
}

exports.CLOTHING_SIZES = {
  XXS: 'XXS',
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL'
}

exports.GENDERS = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
}

exports.HEIGHT_UNITS = {
  FT_IN: 'ft/in',
  CM: 'cm'
}

exports.QUERY_PARAM_TO_HEIGHT_UNITS = {
  'ft/in': this.HEIGHT_UNITS.FT_IN,
  cm: this.HEIGHT_UNITS.CM
}

exports.WEIGHT_UNITS = {
  LBS: 'lbs',
  KGS: 'kgs'
}

exports.QUERY_PARAM_TO_WEIGHT_UNITS = {
  lbs: this.WEIGHT_UNITS.LBS,
  kgs: this.WEIGHT_UNITS.KGS
}

exports.ACCEPTED_FILETYPES = 'image/png, image/jpeg'

exports.ALL_ACCEPTED_FILETYPES = new Set([
  'png', 'jfif', 'pjpeg', 'jpeg', 'pjp', 'jpg'
])

exports.MAX_FILESIZE_BYTES = 5000000

exports.CLOTHING_GENDERS_SHORT_TO_FULL = {
  m: 'Men\'s',
  w: 'Women\'s',
  u: 'Unisex'
}

exports.GENDERS_SHORT_TO_FULL = {
  m: 'Male',
  f: 'Female',
  o: 'Other'
}

// keys that are the same for the db, elasticsearch, and form inputs
exports.POST_KEYS = {
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
