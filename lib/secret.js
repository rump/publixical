'use strict';
var crypto = require('crypto');


exports.cipher = function (input, secret, callback) {
  var cipher = crypto.createCipher('aes128', secret);
  var output = '';

  if (!input) {
    return false;
  }

  try {
    output += cipher.update(input, 'utf8', 'hex');
    output += cipher.final('hex');
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
  var output = '';

  if (!input) {
    return false;
  }

  try {
    output += decipher.update(input, 'hex', 'utf8');
    output += decipher.final('utf8');
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
