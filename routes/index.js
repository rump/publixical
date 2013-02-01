'use strict';
var express = require('express');
var app = require('..');


app.get('/', function (req, res) {
  return res.render('index');
});


app.post('/', express.bodyParser(), function (req, res, next) {
  var host = req.headers.host || app.settings.host + ":" + app.settings.port;
  var publix = require('../lib/publix');
  var secret = require('../lib/secret').cipher;
  var u = req.body.u;
  var p = req.body.p;

  if (!u || !p) {
    res.locals.err = 'A username and password might be required.';
    return next();
  }

  publix.login(null, u, p, function (err) {
    if (err && err.message === '401') {
      res.locals.err = 'Invalid username or password.';
      return next();
    }

    return res.redirect('webcal://' + host + '/webcal' + '?u=' + secret(u) + '&p=' + secret(p));
  });
});
