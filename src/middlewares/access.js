'use strict';

/**
 * Import Node.JS modules.
 */
const jwt = require('jsonwebtoken');

/**
 * Import dependencies.
 */
const config = require('../config');
const roles = require('../roles');

/**
 * Function to restrict controller routes with roles. Roles are defined in the roles.js file.
 * @param { String } resource
 * @param { String } access
 */
function check(controller, route) {
  return async (request, response, next) => {
    const accessToken = request.headers.authorization.split(' ')[1];

    try {
      const payload = await jwt.verify(accessToken, config.jwtSecret);
      const permissions = roles[payload.role].controllers[controller][route];

      if (!permissions)
        return response.status(401).json({
          resolved: 'failure',
          message: 'Unauthorized.',
        });

      if (permissions === 'own') request.restrict = payload._id;
    } catch (error) {
      return response.status(500).json({
        resolved: 'failure',
        message: 'Something went wrong.',
        error,
      });
    }

    return next();
  };
}

module.exports = {
  check,
};
