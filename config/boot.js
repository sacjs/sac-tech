'use strict';

var hapi = require('hapi');

var app = require('./application');
var env = require('./environment');
var pkg = require('../package.json');

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

// Starts the Slackin server
console.log('Starting Slackin service on port %d', env.get('slackinPort'));
require('slackin')({
  channels: env.get('slackChannel'),
  interval: env.get('slackinInterval'),
  org: env.get('slackSubdomain'),
  silent: false,
  token: env.get('slackApiToken')
}).listen(env.get('slackinPort'));


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
