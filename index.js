#!/usr/bin/env node
'use strict';
var express = require('express');
var fs = require('fs');

var app = module.exports = express();
var config = require('./config');
for (var config_key in config) {
  app.set(config_key, config[config_key]);
}

app.use(express.compress());
app.use(express['static']('./public', { maxAge: 1000 * 60 * 60 * 24 * 30 }));
if (app.get('env') === 'development') {
  app.use(express.logger());
}

app.use(app.router);
fs.readdirSync('./routes').forEach(function (file) {
  require('./routes/' + file);
});

app.listen(app.get('port'));

process.title = 'publixical';
process.setgid('www-data');
process.setuid('nobody');

console.log('OK');
