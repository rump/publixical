'use strict';
var superagent = require('superagent');

var config = {
  schedule_url: 'https://oasis-sso.publix.org/ess/Schedule.aspx',
  regex: '<td><DIV>(.*?)</DIV></td><td><DIV>(.*?)</DIV></td><td><DIV>(.*?)</DIV></td><td><DIV>(.*?)</DIV></td><td class="numberMeHeader"><DIV>(.*?)</DIV></td><td class="numberMe"><DIV>(.*?)</DIV></td>'
};


exports.login = function (agent, u, p, callback) {
  agent = agent || superagent.agent();

  agent
  .post('https://oasis-sso.publix.org/pkmslogin.form')
  .send('login-form-type=pwd')
  .send('username=' + u)
  .send('password=' + p)
  .timeout(1000 * 10)
  .end(function (err, res) {

//    if (err.timeout) {
//      return callback(new Error('The Publix backend appears to be down or too slow. Please try again later!'));
//    }
//    if (err) {
//      console.error(err);
//      return callback(new Error('Something went horribly wrong. We\'re looking into it!'));
//    }
//    if (res.status !== 200) {
//      return callback(new Error('The Publix backend appears to be undergoing maintenance or made some changes we aren\'t prepared for! Please let us know if the problem persists!'));
//    }

    if (err) throw err;

    if (res.text.indexOf('<title>Success</title>') === -1) {
      return callback(new Error('401'));
    }

    // success
    return callback(null, agent);
  });
};


exports.schedule = function (agent) {
  agent = agent || superagent.agent();

};


exports.parse = function (body) {

};
