/* globals EventSource */
'use strict';

var btn = document.querySelector('button');
var cocCheckbox = document.querySelector('.coc-agree');
var source = new EventSource('/status');

btn.addEventListener('click', function(e) {
  btn.innerHTML = btn.dataset.label;
  btn.classList.remove('error');
  if(!cocCheckbox.checked) {
    e.preventDefault();
    btn.classList.add('error');
    btn.innerHTML = 'You must agree to the COC';
    return;
  }
}, false);

source.addEventListener('update', function(e) {
  var data = JSON.parse(e.data);
  document.querySelector('.active').innerHTML = data.activeUserCount;
  document.querySelector('.total').innerHTML = data.totalUserCount;
}, false);
