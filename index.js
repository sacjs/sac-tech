const app = require('./config/application');
const Hapi = require('@hapi/hapi');
const pkg = require('./package.json');
const env = require('./config/environment');
const SlackSource = require('./app/datasources/slack');

async function init() {
  // Create the server
  const server = Hapi.server({
    port: env.get('port'),
    mime: {
      override: {
        'text/event-stream': {
          compressible: false
        }
      }
    }
  });
  await server.register(require('@hapi/inert'));

  app.routes.forEach(function(route) {
    server.route(route);
  });

  SlackSource.initialize({
    interval: env.get('slackinInterval'),
    org: env.get('slackSubdomain'),
    token: env.get('slackApiToken')
  });

  // Starts the server with pretty-printed output
  console.log('=> Booting server');
  console.log('=> %s v%s Web application starting in %s on %s', pkg.name, pkg.version, env.get('env'), server.info.uri);
  console.log('=> Ctrl-C to shutdown server');
  await server.start()
  console.log('=> Listening for Web requests on %s', server.info.uri);
}

init();
