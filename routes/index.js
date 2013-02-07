'use strict';
var express = require('express');
var app = require('..');


app.get('/', function (req, res) {
  var quote = app.settings.quotes[Math.floor(Math.random() * app.settings.quotes.length)];
  return res.render('index', { quote: quote });
});


app.post('/', express.bodyParser(), function (req, res, next) {
  var host = req.headers.host || app.settings.host + ":" + app.settings.port;
  var publix = require('../lib/publix');
  var secret = require('../lib/secret').cipher;
  var u = req.body.u;
  var p = req.body.p;

  publix.login(u, p, function (err) {
    if (err) return next(err);
    return res.redirect('webcal://' + host + '/webcal.ics' + '?u=' + secret(u, app.settings.secret) + '&p=' + secret(p, app.settings.secret));
  });
});
