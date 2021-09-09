'use strict';

var path = require('path');
var convict = require('convict');
var Root = path.resolve('.');
var config;

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'staging', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  host: {
    doc: 'Hostname the application run on',
    format: 'url',
    default: 'localhost',
    env: 'HOST'
  },
  port: {
    doc: 'Port the application listens on',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  slackApiToken: {
    default: null,
    doc: 'The API Token for the Slack Team',
    env: 'SLACK_API_TOKEN',
    format: String
  },
  slackChannel: {
    default: null,
    doc: 'Name of a single guest channel to invite them to (leave blank for a normal, all-channel invite)',
    env: 'SLACK_CHANNEL',
    format: '*'
  },
  slackinInterval: {
    default: 1000,
    doc: 'The interval with which to poll Slack for active user info',
    env: 'SLACKIN_INTERVAL',
    format: 'int'
  },
  slackinPort: {
    default: 3001,
    doc: 'The port to run the Slackin service on',
    env: 'SLACKIN_PORT',
    format: 'port'
  },
  slackSubdomain: {
    default: null,
    doc: 'The Subdomain for the Slack Team',
    env: 'SLACK_SUBDOMAIN',
    format: String
  },
  publicAssets: {
    doc: 'The path that public assets are served from',
    format: String,
    default: path.join(Root, 'public/assets')
  }
});

config.validate();

module.exports = config;
