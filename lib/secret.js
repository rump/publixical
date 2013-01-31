'use strict';
var crypto = require('crypto');
var app = require('..');
var secret = app.settings.secret || 'secret';


exports.cipher = function (input, next) {
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
    if (app.get('env') === 'development') throw err;
    output = false;
  }

  if (next) {
    return next(null, output);
  }
  return output;
};


exports.decipher = function (input, next) {
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
    if (app.get('env') === 'development') throw err;
    output = false;
  }

  if (next) {
    return next(null, output);
  }
  return output;
};
