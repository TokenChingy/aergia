'use strict';

/**
 * Import Node.JS modules.
 */
const fs = require('fs');

/**
 * Returns an object with controllers to be consumed
 * by the Express app.
 */
module.exports = (collections, io) => {
  const controllers = {};

  fs.readdirSync(__dirname).forEach((file) => {
    if (file !== 'index.js' && file.includes('.js')) {
      const controllerName = file.split('.')[0];
      controllers[controllerName] = require(`./${file}`)(collections, io);
    }
  });

  return controllers;
};
