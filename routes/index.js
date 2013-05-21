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
    var secret_u = secret(u, app.settings.secret);
    var secret_p = secret(p, app.settings.secret);

    if (/Android/i.test(req.headers['user-agent'])) return res.render('android', { url: req.protocol + '://' + host + '/webcal.ics' + '?<wbr>u=' + secret_u + '&amp;<wbr>p=' + secret_p });

    return res.redirect('webcal://' + host + '/webcal.ics' + '?u=' + secret_u + '&p=' + secret_p);
  });
});
