'use strict';
var express = require('express');
var app = require('..');


app.get('/', function (req, res) {
  return res.render('index');
});


app.post('/', express.bodyParser(), function (req, res, next) {
  var host = req.headers.host || app.settings.host + ":" + app.settings.port;
  var secret = require('../lib/secret').cipher;
  var u = secret(req.body.u);
  var p = secret(req.body.p);

  if (!u || !p) {
    return next();
  }

  return res.redirect('webcal://' + host + '/webcal' + '?u=' + u + '&p=' + p);
});
