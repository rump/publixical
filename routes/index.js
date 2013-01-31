'use strict';
var express = require('express');
var app = require('..');


app.get('/', function (req, res) {
  return res.render('index');
});


app.post('/', express.bodyParser(), function (req, res, next) {
  if (!req.body.u || !req.body.p) {
    return next();
  }

  var secret = require('../lib/secret').cipher;
  var host = req.headers.host || app.settings.host + ":" + app.settings.port;

  return res.redirect('webcal://' + host + '/webcal' +
    '?u=' + secret(req.body.u) +
    '&p=' + secret(req.body.p)
  );
});
