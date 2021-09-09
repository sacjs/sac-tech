'use strict';

var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var emptyFn = function() {};
var request = require('superagent');
var SlackConstants = require('../constants/SlackConstants');
var UrlTemplate = require('url-template');
var when = require('when');

var SlackUrl = UrlTemplate.parse('https://{org}.slack.com/api/rtm.start');
var CONFIG = {};
var POLLER = null;

require('../stores/SlackStore');

function pingSlack() {
  var promise = when.promise(function(resolve, reject) {
  request
    .get(SlackUrl.expand(CONFIG))
    .query({ token: CONFIG.token })
    .end(function(err, res) {
      if(err) {
        return reject(err);
      }
      resolve(res.body);
    });
    AppDispatcher.handleServerAction({
      type: SlackConstants.SLACK_REFRESH_BEGIN
    });
  })
  .tap(function(data) {
    AppDispatcher.handleServerAction({
      type: SlackConstants.SLACK_REFRESHED,
      data: data
    });
  })
  .catch(function(err) {
    AppDispatcher.handleServerAction({
      type: SlackConstants.SLACK_REFRESH_ERROR,
      error: err
    });
  })
  .finally(function() {
    AppDispatcher.handleServerAction({
      type: SlackConstants.SLACK_REFRESH_END
    });
  });
  return promise;
}

function pollSlack() {
  if(POLLER) {
    clearTimeout(POLLER);
  }
  POLLER = setTimeout(function() {
    pingSlack()
      .tap(pollSlack)
      .catch(emptyFn);
  }, CONFIG.interval);
}

function startPollingSlack() {
  pingSlack()
    .tap(pollSlack)
    .catch(emptyFn);
}

module.exports = {
  initialize: function(slackCfg) {
    CONFIG = _.assign({}, slackCfg);
    startPollingSlack();
  }
};
