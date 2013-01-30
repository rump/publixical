'use strict';
var app = require('..');

app.get('/404', function (req, res) {
  return res.render('404');
});
