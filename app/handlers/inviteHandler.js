'use strict';

var invite = require('../requests/slackInvite');

var EMAIL_CHECK = /.+@.+\..+/;

module.exports = async function inviteHandler(request, h) {
  var email = (request.payload.email || '').trim();
  if(email === '') {
    return h.response({ msg: 'No email provided' }).code(422);
  }
  if(!EMAIL_CHECK.test(email)) {
    return h.response({ msg: 'Invalid email' }).code(422);
  }
  try {
    await invite(email)
    return h.response({ msg: 'success' });
  } catch(error) {
    return h.response({ msg: error.message }).code(422);
  }
};
