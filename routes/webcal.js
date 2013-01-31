'use strict';
var app = require('..');


app.get('/webcal', function (req, res, next) {
  var secret = require('../lib/secret').decipher;
  var u = secret(req.query.u);
  var p = secret(req.query.p);

  if (!u || !p) {
    return next();
  }



  return res.render('webcal', {
    u: u,
    p: p
  });
});
