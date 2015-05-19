'use strict';

var SlackStore = require('../stores/SlackStore');

module.exports = function slackPrerequisite(request, reply) {
  reply(SlackStore.getState());
};
