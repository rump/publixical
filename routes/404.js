'use strict';
var app = require('..');


app.use(function (req, res, next) {
  res.statusCode = 404;
  return res.render('404');
});


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.statusCode = 500;
  return res.render('404');
});
