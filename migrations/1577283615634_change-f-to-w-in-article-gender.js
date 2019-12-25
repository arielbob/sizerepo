/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameTypeValue('article_gender', 'f', 'w')
};

exports.down = (pgm) => {
  pgm.renameTypeValue('article_gender', 'w', 'f')
};
