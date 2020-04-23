'use strict';

/**
 * Import Node.JS modules.
 */
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketio = require('socket.io');
const socketioRedis = require('socket.io-redis');

/**
 * Import dependencies.
 */
const config = require('./config');
const controllers = require('./controllers');
const models = require('./models');

/**
 * Entry point, using an IIFE to enable "top-level" async/await.
 */
(async () => {
  /**
   * Create an instance of Express and configure it as required.
   */
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('tiny'));
  app.use(express.static('public'));

  /**
   * Wrap the express app in the http/https server. Wrap the server
   * with Socket.IO. Enable Redis for Socket.IO.
   */
  const server = http.Server(app);
  const io = socketio(server);

  io.adapter(socketioRedis(config.redisUri));
  io.of('/').adapter.on('error', (error) => {
    console.error(error);
  });

  /**
   * Connect to the MongoDB instance and initiate all the schemas'
   * provided in the models directory. Return an reference to the
   * database for use later.
   */
  const collections = models(config.mongoDbUri, config.mongoDbConfig);

  /**
   * Using the models, generate CRUD endpoints for them. Any custom
   * endpoints will also be added in from the controllers directory.
   */
  const routers = controllers(collections, io);

  Object.keys(routers).forEach((router) => {
    app.use(`/${config.apiPrefix}/${router}`, routers[router]);
  });

  /**
   * Start the server once everything is configured and ready.
   */
  try {
    server.listen(config.appPort, config.appHost);
    console.log(
      `_api is listening at http://${config.appHost}:${config.appPort}.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
