'use strict';

/**
 * This is our roles object, each role contains controllers which contain routes.
 * You have some default options when defining a route - 'all' and 'own'. You may
 * create your own custom options, but you will need to modify the 'middleware/access.js'
 * file's check() function to handle those.
 *
 * 'own' will modify the request object and add a new key 'restrict' the value of
 * this key is the users '_id'. You can then use this in your routes to check for
 * ownership by checking references in your Mongoose model.
 *
 * 'all' is default. Technically, you can leave it as a blank string.
 */
module.exports = {
  user: {
    controllers: {
      users: {
        readById: 'own',
        update: 'own',
      },
    },
  },
  admin: {
    controllers: {
      users: {
        create: 'all',
        read: 'all',
        readById: 'all',
        update: 'all',
        delete: 'all',
      },
    },
  },
};
