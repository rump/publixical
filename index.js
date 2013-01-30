#!/usr/bin/env node
"use strict";

var config = require('./config');
var routes = require('./routes');
var express = require('express');

var app = express();
app.locals.config = config;
app.use(express.bodyParser());
if (process.env.NODE_ENV === 'development') {
  app.use(express.logger('dev'));
}

app.get('/', function (req, res) {
  return res.render('index.ejs');
});

app.post('/', function (req, res) {
  if (!req.body.username || !req.body.password) {
    return res.render('oops.ejs');
  }
  res.redirect('/ical');
});

app.get('/ical', function (req, res) {
  res.end('hello world');
});

app.listen(config.port);
console.log('OK');
