'use strict';

var invite = require('../requests/slackInvite');

var EMAIL_CHECK = /.+@.+\..+/;

module.exports = function inviteHandler(req, reply) {
  var email = (req.payload.email || '').trim();
  if(email === '') {
    return reply({ msg: 'No email provided' }).code(422);
  }
  if(!EMAIL_CHECK.test(email)) {
    return reply({ msg: 'Invalid email' }).code(422);
  }
  invite(email, function(err) {
    if(err) {
      return reply({ msg: err.message }).code(422);
    }
    reply({ msg: 'success' });
  });
};
