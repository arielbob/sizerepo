/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createType('article_gender', ['m', 'f', 'u'])
  pgm.createType('article_type', [
    'shirt',
    'pants',
    'shorts',
    'outerwear',
    'knitwear',
    'sweatshirt',
    'other'
  ])
  pgm.createType('article_size', [
    'xxs',
    'xs',
    's',
    'm',
    'l',
    'xl',
    'xxl'
  ])
  pgm.createType('gender', ['m', 'f', 'o'])

  pgm.createTable('posts', {
    id: { type: 'serial', primaryKey: true },
    brand: { type: 'varchar(100)', notNull: true },
    article_name: { type: 'varchar(100)', notNull: true },
    article_gender: { type: 'article_gender', notNull: true },
    article_type: { type: 'article_type', notNull: true },
    article_size: { type: 'article_size' },
    article_waist: { type: 'smallint' },
    article_inseam: { type: 'smallint' },
    height_m: { type: 'real', notNull: true },
    weight_kg: { type: 'real', notNull: true },
    gender: { type: 'gender', notNull: true },
    image_url: { type: 'string', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
};

exports.down = (pgm) => {
  pgm.dropTable('posts')
  pgm.dropType('article_gender')
  pgm.dropType('article_type')
  pgm.dropType('article_size')
  pgm.dropType('gender')
};
