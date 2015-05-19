'use strict';

var AppConstants = require('../constants/AppConstants');
var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

AppDispatcher.handleViewAction = function (action) {
  var payload = {
    source: AppConstants.VIEW_ACTION,
    action: action
  };
  this.dispatch(payload);
};

AppDispatcher.handleServerAction = function (action) {
  var payload = {
    source: AppConstants.SERVER_ACTION,
    action: action
  };
  this.dispatch(payload);
};

module.exports = AppDispatcher;
