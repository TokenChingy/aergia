'use strict';

/**
 * Import Node.JS modules.
 */
const express = require('express');

/**
 * Import dependencies.
 */
const access = require('../middlewares/access');
const crud = require('../crud');

module.exports = (collections, io) => {
  /**
   * Import our template CRUD functions. Create an
   * Express router instance.
   */
  const template = crud(collections.Users);
  const router = express.Router();

  /**
   * Define our routes on our router. These will be
   * prefixed with /{apiPrefix}/{controllerName}/{routeName}.
   */
  router.post('/', access.check('users', 'create'), template.create);

  router.get('/', access.check('users', 'read'), template.read);

  router.get('/:_id', access.check('users', 'readById'), template.readById);

  router.put('/:_id', access.check('users', 'update'), template.update);

  router.delete('/:_id', access.check('users', 'delete'), template.delete);

  /**
   * Return our router instance for consumption by the express
   * app at the top level.
   */
  return router;
};
