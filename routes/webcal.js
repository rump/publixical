'use strict';
var app = require('..');


app.get('/webcal.ics', function (req, res, next) {
  var publix = require('../lib/publix');
  var secret = require('../lib/secret').decipher;
  var u = secret(req.query.u, app.settings.secret);
  var p = secret(req.query.p, app.settings.secret);

  // series
  publix.login(u, p, function (err, agent) {
    if (err) return next(err);

    publix.schedule(agent, function (err, agent) {
      if (err) return next(err);

      publix.parse(agent.text, function (err, employee, events) {
        if (err) return next(err);

        res.setHeader('content-type', 'text/calendar');
        // res.setHeader('content-type', 'text/plain');
        return res.render('webcal', { employee: employee, events: events, tz: req.query.tz });
      });
    });
  });
});
