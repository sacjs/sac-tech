'use strict';

module.exports = function rootHandler(request, reply) {
  reply.proxy({
    passThrough: true,
    timeout: 1000,
    uri: '/'
  });
};
