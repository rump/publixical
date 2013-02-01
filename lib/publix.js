'use strict';
var superagent = require('superagent');
var app = require('..');
var config = {
  schedule_url: 'https://oasis-sso.publix.org/ess/Schedule.aspx',
  regex: '<td><DIV>(.*?)</DIV></td><td><DIV>(.*?)</DIV></td><td><DIV>(.*?)</DIV></td><td><DIV>(.*?)</DIV></td><td class="numberMeHeader"><DIV>(.*?)</DIV></td><td class="numberMe"><DIV>(.*?)</DIV></td>'
};


exports.login = function (agent, u, p, next) {
  agent = agent || superagent.agent();

  agent
  .post('http://localhost:8889/')
  .send('login-form-type=pwd')
  .send('username=' + u)
  .send('password=' + p)
  .timeout(1000 * 30)
  .end(function (err, res) {
    console.log(res);

    if (err.timeout) {
      return next(new Error('The Publix backend appears to be down to too slow. Please try again later!'));
    }
    if (err) {
      console.error(err);
      return next(new Error('Something went horribly wrong. We\'re looking into it!'));
    }
    if (res.status !== 200) {
      return next(new Error('The Publix backend appears to be undergoing maintenance or made some changes we aren\'t prepared for! Please let us know if the problem persists!'));
    }
    if (res.text.indexOf('<title>Success</title>') !== -1) {
      return next(new Error('Oops, incorrect username or password.'));
    }
  });
};


exports.schedule = function (agent) {
  agent = agent || superagent.agent();

};


exports.parse = function (body) {

};
