'use strict';

var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;

var GenericStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(AppConstants.CHANGE_EVENT);
  },
  getState: function() {
    throw new Error('getState not implemented');
  },
  subscribe: function(callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },
  unsubscribe: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  }
});

module.exports = GenericStore;
