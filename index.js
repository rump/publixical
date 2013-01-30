#!/usr/bin/env node
"use strict";
var config = require('./config');
var express = require('express');
var fs = require('fs');

var app = module.exports = express();
app.locals.config = config;
app.set('view engine', 'ejs');

if (app.get('env') === 'development') {
  app.use(express.logger('dev'));
}
app.use(express['static']('./public'));
app.use(express.bodyParser());

fs.readdirSync('./routes').forEach(function (file) {
  require('./routes/' + file);
});

app.listen(config.port);
console.log('OK');
