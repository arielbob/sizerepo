/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('posts', {
    is_indexed: {
      type: 'boolean',
      notNull: true,
      default: false
    }
  })
};

exports.down = (pgm) => {
  pgm.dropColumns('posts', ['is_indexed'])
};
