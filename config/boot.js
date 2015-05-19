'use strict';

var app = require('./application');
var env = require('./environment');
var hapi = require('hapi');
var pkg = require('../package.json');
var SlackSource = require('../app/datasources/slack');

// Create the server
var server = new hapi.Server(require('./server.js'));
server.connection({
  host: env.get('host'),
  port: env.get('port'),
  labels: 'web'
});

app.routes.forEach(function(route) {
  server.route(route);
});

SlackSource.initialize({
  interval: env.get('slackinInterval'),
  org: env.get('slackSubdomain'),
  token: env.get('slackApiToken')
});

// Starts the server with pretty-printed output
function startServer() {
  console.log('=> Booting server');
  console.log('=> %s v%s Web application starting in %s on %s', pkg.name, pkg.version, env.get('env'), server.select('web').info.uri);
  console.log('=> Ctrl-C to shutdown server');
  server.start(function() {
    console.log('=> Listening for Web requests on %s', server.select('web').info.uri);
    console.log('');
  });
}
server.method('start', startServer, {});

module.exports = server;
