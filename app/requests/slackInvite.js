'use strict';

var env = require('../../config/environment');
var request = require('superagent');
var UrlTemplate = require('url-template');
var InviteUrl = UrlTemplate.parse('https://{org}.slack.com/api/users.admin.invite');

module.exports = function invite(email) {
  var url = InviteUrl.expand({ org: env.get('slackSubdomain') });
  var data = {
    email: email,
    token: env.get('slackApiToken')
  };

  return new Promise((resolve, reject) => {
    request
      .post(url)
      .type('form')
      .send(data)
      .end(function(err, res) {
        var providedError;
        var needed;
        var ok;
        if(err) {
          return reject(err);
        }
        if(res.status !== 200) {
          return reject(new Error('Invalid response ' + res.status + '.'));
        }
        // If the account that owns the token is not admin, Slack will oddly
        // return `200 OK`, and provide other information in the body. So we
        // need to check for the correct account scope and call the callback
        // with an error if it's not high enough.
        ok = res.body.ok;
        providedError = res.body.error;
        needed = res.body.needed;
        if(ok) {
          return resolve();
        }
        if(providedError === 'missing_scope' && needed === 'admin') {
          return reject(new Error('Missing admin scope: The token you provided is for an account that is not an admin. You must provide a token from an admin account in order to invite users through the Slack API.'));
        }
        return reject(new Error(providedError));
      });
  })
};
