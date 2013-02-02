'use strict';
var app = require('..');


app.use(function (req, res, next) {
  res.statusCode = 404;
  return res.render('error', { err: 'You\'re looking for something that doesn\'t exist!' });
});


app.use(function (err, req, res, next) {
  var i = err.message.indexOf(':');
  res.statusCode = (i !== -1) ? err.message.slice(0, i) : 500;
  return res.render('error', { err: err.message.slice(i + 1) || 'Something went horribly wrong. We\'re looking into it!' });
});
