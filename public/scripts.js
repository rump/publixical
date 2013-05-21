'use strict';

(function () {
  var m = "\x70\x75\x62\x6C\x69\x78\x69\x63\x61\x6C\x40\x73\x65\x61\x6E\x64\x75\x6E\x61\x77\x61\x79\x2E\x63\x6F\x6D";
  var c = document.getElementById('contact');
  c.href = 'mailto:' + m + '?Subject=Publix%20iCal';
  c.innerHTML = m;
}());
