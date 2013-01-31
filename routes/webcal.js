'use strict';
var app = require('..');


app.get('/webcal', function (req, res, next) {
  if (!req.query.u || !req.query.p) {
    return next();
  }

  var secret = require('../lib/secret').decipher;
  var u = secret(req.query.u);
  var p = secret(req.query.p);



  return res.render('webcal');
});
