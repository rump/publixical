'use strict';
var app = require('..');


app.get('/webcal', function (req, res, next) {
  if (!req.query.u || !req.query.p) {
    return next();
  }

  var secret = require('../lib/secret').decipher;



  return res.render('webcal');
});
