'use strict';
var app = require('..');


app.get('/webcal', function (req, res, next) {
  var publix = require('../lib/publix');
  var secret = require('../lib/secret').decipher;
  var u = secret(req.query.u);
  var p = secret(req.query.p);

  if (!u || !p) {
    return next();
  }

  // series
  publix.login(null, u, p, function (err) {
    if (err) throw err;
  });

  return res.render('webcal', {
    u: u,
    p: p
  });
});
