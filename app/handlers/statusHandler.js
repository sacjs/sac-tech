'use strict';

var _ = require('lodash');
var PassThrough = require('stream').PassThrough;
var SlackStore = require('../stores/SlackStore');

var EVENT_NAME = 'update';

function streamer(channel) {
  var state = SlackStore.getState();
  var id = (new Date()).toLocaleTimeString();
  channel.write('id: ' + id + '\n');
  channel.write('event: ' + EVENT_NAME + '\n');
  channel.write('data: ' + JSON.stringify(state) + '\n\n');
}

module.exports = function statusHandler(request, reply) {
  var channel = new PassThrough();
  var listener = _.partial(streamer, channel);
  SlackStore.subscribe(listener);
  request.raw.req.on('close', function() {
    SlackStore.unsubscribe(listener);
  });
  reply(channel).type('text/event-stream');
};
