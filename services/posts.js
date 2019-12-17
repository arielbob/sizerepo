const db = require('../db')
const { CLOTHING_TYPES } = require('../common/constants')

// TODO: move ES document creation here as well
exports.create = (data) => {
  // NOTE: might not need these anymore, since we just take them out in the route
  const articleWaist =
    (data.article_type === CLOTHING_TYPES.PANTS || data.article_type === CLOTHING_TYPES.SHORTS) ?
    data.waist : null

  const articleInseam =
    (data.article_type === CLOTHING_TYPES.PANTS || data.article_type === CLOTHING_TYPES.SHORTS) ?
    data.inseam : null

  const articleSize =
    (data.article_type === CLOTHING_TYPES.PANTS || data.article_type === CLOTHING_TYPES.SHORTS) ?
    null : data.size

  // TODO: we should just make an object schema specific for this function
  // and then create an object like that so we don't have to do things like convert empty strings to null
  return db.one(`
    INSERT INTO posts (
      brand,
      article_name,
      article_gender,
      article_type,
      article_size,
      article_waist,
      article_inseam,
      height_m,
      weight_kg,
      gender,
      image_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id
  `, [
    data.brand,
    data.article_name,
    data.article_gender,
    data.article_type,
    data.article_size || null,
    data.article_waist || null,
    data.article_inseam || null,
    data.height_m,
    data.weight_kg,
    data.gender,
    data.image_url
  ]).then(row => row.id)
}

exports.getPosts = (limit) => {
  return db.any('SELECT * FROM posts ORDER BY created_at DESC LIMIT $1', [limit])
}
