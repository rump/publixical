#!/usr/bin/env node
"use strict";

var config = require('./config');
var express = require('express');
var app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(express.logger('dev'));
}

app.post('/', function (req, res) {
  console.log(req);
});

app.use(express['static']('./public'));
app.listen(config.port);
console.log('OK');
