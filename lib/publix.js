'use strict';
var superagent = require('superagent');
var timeout = 1000 * 60;


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
  var employee;
  var events = [];
  var events_regex = /<td><DIV>(.*?)<\/DIV><\/td><td><DIV>(.*?)<\/DIV><\/td><td><DIV>(.*?)<\/DIV><\/td><td><DIV>(.*?)<\/DIV><\/td><td class="numberMeHeader"><DIV>(.*?)<\/DIV><\/td><td class="numberMe"><DIV>(.*?)<\/DIV><\/td>/g;
  var item = {};
  var match = events_regex.exec(text);

  // events
  while (match) {
    item = {
      day: match[1].split(' ')[0],
      date: match[1].split(' ')[1],
      time_begin: match[2].split(' - ')[0],
      time_end: match[2].split(' - ')[1],
      position: match[3],
      location: match[4],
      meals: match[5] ? parseInt(match[5], 10) : 0,
      hours: match[6] ? parseInt(match[6], 10) : 0,
      timestamp: format_datetime(new Date()),
      rand: Math.random()
    };

    // fix swing shifts
    item.datetime_begin = new Date(item.date + ' ' + item.time_begin);
    item.datetime_end = new Date(item.date + ' ' + item.time_end);
    if (item.datetime_end < item.datetime_begin) {
      item.datetime_end.setDate(item.datetime_end.getDate() + 1);
    }

    item.datetime_begin = format_datetime(item.datetime_begin);
    item.datetime_end = format_datetime(item.datetime_end);

    events.push(item);
    match = events_regex.exec(text);
  }

  // employee name
  employee = /Welcome: (.+?), (.+?)</.exec(text);
  employee = employee[2] + ' ' + employee[1];

  return callback(null, employee, events);
};


function format_datetime(date) {
  date = date instanceof Date ? date : new Date(date);

  return date.getFullYear() +
    fix(date.getMonth() + 1) +
    fix(date.getDate()) +
    'T' +
    fix(date.getHours()) +
    fix(date.getMinutes()) +
    fix(date.getSeconds());

  function fix(n) {
    return n < 10 ? '0' + n : n;
  }
}


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
