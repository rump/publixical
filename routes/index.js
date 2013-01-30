'use strict';
var app = require('..');

app.get('/', function (req, res) {
  return res.render('index');
});

app.post('/', function (req, res) {
  if (!req.body.username || !req.body.password) {
    return res.redirect('/404');
  }

  return res.redirect('/ical');
});
