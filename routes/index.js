'use strict';
var app = require('..');


app.get('/', function (req, res) {
  console.log(req);
  return res.render('index');
});


app.post('/', function (req, res, next) {
  var secret = require('../lib/secret').cipher;
  var host = req.headers.host || app.settings.host + ":" + app.settings.port;

  if (!req.body.u || !req.body.p) {
    return next();
  }

  return res.redirect('webcal://' +
    req.headers.host +
    '/webcal' +
    '?u=' + secret(req.body.u, app.settings.secret) +
    '&p=' + secret(req.body.p, app.settings.secret));
});
