'use strict';

var _ = require('lodash');
var env = require('./environment');
var path = require('path');

var SlackinPaths = [
  '/invite',
  '/assets/client.js',
  '/assets/slack.svg',
  '/assets/superagent.js',
  '/socket.io/'
];
var SlackinRoutes = _.map(SlackinPaths, function(slackPath) {
  return {
    method: ['GET', 'POST'],
    path: slackPath,
    handler: {
      proxy: {
        host: env.get('host'),
        port: env.get('slackinPort'),
        protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
        passThrough: true,
        xforward: true
      }
    }
  };
});

module.exports = [{
  method: 'GET',
  path: '/',
  handler: {
    file: path.join(env.get('publicAssets'), '..', 'index.html')
  }
}, {
  method: 'GET',
  path: '/assets/{param*}',
  handler: {
    directory: {
      path: env.get('publicAssets')
    }
  }
}].concat(SlackinRoutes);
