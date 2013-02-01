#!/usr/bin/env node
'use strict';
var express = require('express');
var fs = require('fs');

var app = module.exports = express();
var config = require('./config');
for (var config_key in config) {
  app.set(config_key, config[config_key]);
}

app.use(express['static']('./public'));
if (app.get('env') === 'development') {
  app.use(express.logger());
}

app.use(app.router);
fs.readdirSync('./routes').forEach(function (file) {
  require('./routes/' + file);
});

app.listen(app.get('port'));
console.log('OK');
