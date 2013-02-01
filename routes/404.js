'use strict';
var app = require('..');


app.use(function (req, res, next) {
  res.statusCode = 404;
  return res.render('404', { err: res.locals.err || 'You\'re looking for something that doesn\'t exist!' });
});


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.statusCode = 500;
  return res.render('404', { err: res.locals.err || 'Something went horribly wrong. We\'re looking into it!' });
});
