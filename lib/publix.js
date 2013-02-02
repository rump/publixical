'use strict';
var superagent = require('superagent');
var timeout = 1000 * 30;

exports.login = function (u, p, callback) {
  var agent = superagent.agent();

  if (!u || !p) {
    return callback(new Error('401:Username and password are required.'));
  }

  agent
  .post('https://oasis-sso.publix.org/pkmslogin.form')
  .send('login-form-type=pwd')
  .send('username=' + u)
  .send('password=' + p)
  .timeout(timeout)
  .end(function (err, res) {

    err = verify_response(err, res);
    if (err) return callback(err);
    if (res.text.search(/<title>Success<\/title>/) === -1) {
      return callback(new Error('401:Invalid username or password.'));
    }

    agent.saveCookies(res);
    return callback(null, agent);
  });
};


exports.schedule = function (agent, callback) {
  agent
  .get('https://oasis-sso.publix.org/ess/Schedule.aspx')
  .timeout(timeout)
  .end(function (err, res) {

    err = verify_response(err, res);
    if (err) return callback(err);
    if (res.text.search(/<title>\s*?Oasis Self Service: My Schedule\s*?<\/title>/) === -1) {
      return callback(new Error('502:Can\'t find schedule.'));
    }

    agent.text = res.text;
    agent.__VIEWSTATE = encodeURIComponent(agent.text.match(/id="__VIEWSTATE" value="(.+?)" \/>/)[1]);
    agent.__EVENTVALIDATION = encodeURIComponent(agent.text.match(/id="__EVENTVALIDATION" value="(.+?)" \/>/)[1]);

    // next weeks also
    agent.post('https://oasis-sso.publix.org/ess/Schedule.aspx')
    .send('__VIEWSTATE=' + agent.__VIEWSTATE)
    .send('__EVENTVALIDATION=' + agent.__EVENTVALIDATION)
    .send('ctl00$ctl00$MainColumn$PageContent$perNav$btnMoveForwardPeriod.x=1')
    .send('ctl00$ctl00$MainColumn$PageContent$perNav$btnMoveForwardPeriod.y=1')
    .timeout(timeout)
    .end(function (err, res) {

      err = verify_response(err, res);
      if (err) return callback(err);
      if (res.text.search(/<title>\s*?Oasis Self Service: My Schedule\s*?<\/title>/) === -1) {
        return callback(new Error('502:Can\'t find next weeks schedule.'));
      }

      // return two full pages of html containing this and next weeks schedule
      agent.text += res.text;
      return callback(null, agent);
    });
  });
};


exports.parse = function (text, callback) {
  var events = [];
  var regex = /<td><DIV>(.*?)<\/DIV><\/td><td><DIV>(.*?)<\/DIV><\/td><td><DIV>(.*?)<\/DIV><\/td><td><DIV>(.*?)<\/DIV><\/td><td class="numberMeHeader"><DIV>(.*?)<\/DIV><\/td><td class="numberMe"><DIV>(.*?)<\/DIV><\/td>/g;
  var match = regex.exec(text);
  while (match) {


    events.push({
      date: match[1],
      time: match[2],
      position: match[3],
      location: match[4],
      meals: match[5],
      hours: match[6]
    });
    match = regex.exec(text);
  }

  return callback(null, events);
};


function verify_response(err, res) {
  if (err && err.timeout) {
    return new Error('504:The Publix backend appears to be down or too slow.');
  }
  if (err) {
    console.error(err.stack);
    return new Error();
  }
  if (res.status !== 200 || res.text.search(/<title>\s*?Oasis Self Service: Error Page\s*?<\/title>/) !== -1) {
    return new Error('502:The Publix backend appears to be undergoing maintenance.');
  }
  return null;
}
