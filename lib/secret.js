'use strict';
var crypto = require('crypto');


exports.cipher = function (input, secret, callback) {
  var cipher = crypto.createCipher('aes128', secret);
  var output;

  if (!input) {
    return false;
  }

  try {
    cipher.update(input, 'utf8');
    output = cipher.final('hex');
  }
  catch (err) {
    if (process.env.NODE_ENV === 'development') throw err;
    output = false;
  }

  if (callback) {
    return callback(null, output);
  }
  return output;
};


exports.decipher = function (input, secret, callback) {
  var decipher = crypto.createDecipher('aes128', secret);
  var output;

  if (!input) {
    return false;
  }

  try {
    decipher.update(input, 'hex');
    output = decipher.final('utf8');
  }
  catch (err) {
    if (process.env.NODE_ENV === 'development') throw err;
    output = false;
  }

  if (callback) {
    return callback(null, output);
  }
  return output;
};
