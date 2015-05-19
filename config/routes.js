'use strict';

var env = require('./environment');
var path = require('path');

module.exports = [{
  method: 'GET',
  path: '/',
  handler: {
    file: path.join(env.get('publicAssets'), '..', 'index.html')
  }
}, {
  method: 'GET',
  path: '/status',
  handler: require('../app/handlers/statusHandler')
}, {
  method: 'GET',
  path: '/assets/{param*}',
  handler: {
    directory: {
      path: env.get('publicAssets')
    }
  }
}];
