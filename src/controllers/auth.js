'use strict';

/**
 * Import Node.JS modules.
 */
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');

/**
 * Import dependencies.
 */
const config = require('../config');

/**
 * Function that hashes a password with the bcrypt module.
 * @param { String } password
 * @return { Boolean }
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Function that compares the plain password with the hashed password using bcrypt.
 * @param { String } plainPassword
 * @param { String } hashedPassword
 * @return { Boolean }
 */
async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = (collections, io) => {
  /**
   * Create an Express router instance.
   */
  const router = express.Router();

  /**
   * Define our routes on our router. These will be
   * prefixed with /{apiPrefix}/{controllerName}/{routeName}.
   */
  router.post('/login', async (request, response) => {
    const payload = request.body;

    try {
      const user = await collections.Users.findOne({ email: payload.email });

      if (!user)
        return response.status(400).json({
          resolved: 'failure',
          message: 'Email does not exist.',
        });

      const isPasswordValid = await validatePassword(
        payload.password,
        user.password,
      );

      if (!isPasswordValid)
        return response.status(400).json({
          resolved: 'failure',
          message: 'Password is incorrect.',
        });

      const accessToken = jwt.sign(
        { _id: user._id, role: user.role },
        config.jwtSecret,
        {
          expiresIn: config.jwtExpiry,
        },
      );

      await collections.Users.findByIdAndUpdate(
        { _id: user._id },
        {
          accessToken,
        },
      );

      user.accessToken = accessToken;

      response.status(200).json({
        resolved: 'success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        resolved: 'failure',
        message: 'Something went wrong.',
        error,
      });
    }
  });

  router.post('/register', async (request, response) => {
    const payload = request.body;

    try {
      payload.password = await hashPassword(payload.password);

      const user = await collections.Users.create(payload);

      const accessToken = jwt.sign(
        {
          _id: user.id,
          role: user.role,
        },
        config.jwtSecret,
        {
          expiresIn: config.jwtExpiry,
        },
      );

      await collections.Users.findByIdAndUpdate(
        { _id: user._id },
        {
          accessToken,
        },
      );

      user.accessToken = accessToken;

      return response.status(200).json({
        resolved: 'success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        resolved: 'failure',
        message: 'Something went wrong.',
        error,
      });
    }
  });

  /**
   * Return our router instance for consumption by the express
   * app at the top level.
   */
  return router;
};
