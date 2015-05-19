'use strict';

var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var GenericStore = require('./GenericStore');
var SlackConstants = require('../constants/SlackConstants');
var SLACKBOT_ID = 'USLACKBOT';
var SlackStore;
var token;

var __activeUserCount = 0;
var __channels = {};
var __refreshing = false;
var __teamIcon = null;
var __totalUserCount = 0;

function countUsers(data) {
  var users = _.filter(data.users, function(user) {
    return user.id !== SLACKBOT_ID && !user.is_bot;
  });
  __totalUserCount = users.length;
  __activeUserCount = _.filter(users, { presence: 'active' }).length;
}

function refreshChannels(data) {
  __channels = data.channels;
}

function refreshIcon(data) {
  __teamIcon = data.team.icon.image_132;
}

function refreshing(newValue) {
  __refreshing = newValue;
}

SlackStore = _.assign({}, GenericStore, {
  getState: function() {
    return {
      activeUserCount: __activeUserCount,
      channels: __channels,
      refreshing: __refreshing,
      teamIcon: __teamIcon,
      totalUserCount: __totalUserCount
    };
  }
});

token = AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.type) {
    case SlackConstants.SLACK_REFRESH_BEGIN:
      refreshing(true);
      break;
    case SlackConstants.SLACK_REFRESHED:
      countUsers(action.data);
      refreshChannels(action.data);
      refreshIcon(action.data);
      break;
    case SlackConstants.SLACK_REFRESH_END:
      refreshing(false);
      break;
    default:
      return true;
  }
  SlackStore.emitChange();
  return true;
});

SlackStore.token = token;

module.exports = SlackStore;
