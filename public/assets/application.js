/* globals EventSource, superagent */
'use strict';

var btn = document.querySelector('button');
var cocCheckbox = document.querySelector('.coc-agree');
var input = document.querySelector('input[type=email]');
var source = new EventSource('/status');
var request = superagent;

function invite(email, fn){
  request
  .post('/invite')
  .send({
    email: email
  })
  .end(function(err, res) {
    var error;
    if(err || res.error) {
      error = err || new Error(res.body.msg || 'Server error');
      return fn(error);
    } else {
      fn(null);
    }
  });
}

btn.addEventListener('click', function(e) {
  e.preventDefault();
  btn.innerHTML = btn.dataset.label;
  btn.classList.remove('error');
  btn.classList.remove('success');
  if(!cocCheckbox.checked) {
    btn.classList.add('error');
    btn.innerHTML = 'You must agree to the COC';
    return;
  }
  invite(input.value, function(err) {
    if(err) {
      btn.removeAttribute('disabled');
      btn.classList.add('error');
      btn.innerHTML = err.message;
    } else {
      btn.disabled = true;
      btn.classList.add('success');
      btn.innerHTML = 'WOOT. Check your email!';
    }
  });
}, false);

source.addEventListener('update', function(e) {
  var data = JSON.parse(e.data);
  document.querySelector('.active').innerHTML = data.activeUserCount;
  document.querySelector('.total').innerHTML = data.totalUserCount;
}, false);

btn.classList.remove('loading');
