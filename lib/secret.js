'use strict';
var crypto = require('crypto');


exports.cipher = function (input, secret, next) {
  var cipher = crypto.createCipher('aes128', secret);
  var output;

  cipher.update(input, 'utf8');
  output = cipher.final('hex');

  if (next) {
    return next(null, output);
  }
  return output;
};


exports.decipher = function (input, secret, next) {
  var decipher = crypto.createDecipher('aes128', secret);
  var output;

  decipher.update(input, 'hex');
  output = decipher.final('utf8');

  if (next) {
    return next(output);
  }
  return output;
};
