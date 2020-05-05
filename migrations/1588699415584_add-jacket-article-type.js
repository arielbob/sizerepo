/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.noTransaction() // since enums cannot be modified within transactions (changed in psql v12)
  pgm.addTypeValue('article_type', 'jacket')
};

exports.down = (pgm) => {
  // removing a type value from an enum is a more involved process
};
