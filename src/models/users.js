'use strict';

/**
 * Import Node.JS modules.
 */
const mongoose = require('mongoose');

/**
 * Define Mongoose schema.
 */
const UsersSchema = new mongoose.Schema({
  email: {
    index: true,
    required: true,
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    default: 'user',
    enum: ['user', 'admin'],
    type: String,
  },
  accessToken: {
    type: String,
  },
});

UsersSchema.set('toJSON', {
  transform: function (document, object, options) {
    delete object.password;
    return object;
  },
});

module.exports = UsersSchema;
