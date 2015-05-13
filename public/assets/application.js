'use strict';

var cocCheckbox = document.querySelector('.coc-agree');
var btn = document.querySelector('button');

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
