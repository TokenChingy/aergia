'use strict';

/**
 * Import Node.JS modules.
 */
require('dotenv').config();

module.exports = {
  apiName: process.env.API_NAME,
  apiPrefix: process.env.API_PREFIX,
  appHost: process.env.APP_HOST,
  appPort: parseInt(process.env.APP_PORT),
  jwtExpiry: process.env.JWT_EXPIRY,
  jwtSecret: process.env.JWT_SECRET,
  mongoDbUri: process.env.MONGODB_URI,
  mongoDbConfig: {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  redisUri: process.env.REDIS_URI,
};
