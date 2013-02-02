'use strict';
var app = require('..');


app.get('/webcal', function (req, res, next) {
  var publix = require('../lib/publix');
  var secret = require('../lib/secret').decipher;
  var u = secret(req.query.u, app.settings.secret);
  var p = secret(req.query.p, app.settings.secret);

  // series
  publix.login(u, p, function (err, agent) {
    if (err) return next(err);

    publix.schedule(agent, function (err, agent) {
      if (err) return next(err);

      publix.parse(agent.text, function (err, events) {
        if (err) return next(err);


        return res.render('webcal', {
          u: u,
          p: p,
          events: events
        });
      });
    });
  });
});
