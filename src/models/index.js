'use strict';

/**
 * Import Node.JS modules.
 */
const fs = require('fs');
const mongoose = require('mongoose');

function toStartCase(string) {
  string = string.toLowerCase().split(' ');
  for (var i = 0; i < string.length; i++) {
    string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
  }
  return string.join(' ');
}

/**
 * Returns an object containing MongooseJS models
 * connected to a MongoDB instance. This function will
 * automatically take MongooseJS schemas declared within files
 * found in the models directory and initiate them as MongooseJS
 * models.
 */
module.exports = (connectionString, options = {}) => {
  const models = {};

  mongoose.connect(connectionString, options);

  fs.readdirSync(__dirname).forEach((file) => {
    if (file !== 'index.js' && file.includes('.js')) {
      const modelName = file.split('.')[0];
      models[toStartCase(modelName)] = mongoose.model(
        modelName,
        require(`./${file}`),
      );
    }
  });

  return models;
};
