'use strict';

/**
 * This is a template CRUD, you can import this to save
 * time building out default CRUD routes for your controllers.
 */
module.exports = (collection) => {
  const routes = {};

  routes.create = async (request, response) => {
    const payload = request.body;

    try {
      const result = await collection.create(payload);

      return response.status(200).json({
        resolved: 'success',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        resolved: 'failure',
        message: 'Something went wrong.',
        error,
      });
    }
  };

  routes.read = async (request, response) => {
    try {
      const result = await collection.find({});

      return response.status(200).json({
        resolved: 'success',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        resolved: 'failure',
        message: 'Something went wrong.',
        error,
      });
    }
  };

  routes.readById = async (request, response) => {
    const _id = request.params._id;

    if (request.restrict)
      return response.status(401).json({
        resolved: 'failure',
        message: 'Unauthorized.',
      });

    try {
      const result = collection.findById(_id);

      return response.status(200).json({
        resolved: 'success',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        resolved: 'failure',
        message: 'Something went wrong.',
        error,
      });
    }
  };

  routes.update = async (request, response) => {
    const _id = request.params._id;
    const payload = request.body;

    if (request.restrict && request.restrict !== _id)
      return response.status(401).json({
        resolved: 'failure',
        message: 'Unauthorized.',
      });

    try {
      const result = await collection.findByIdAndUpdate(_id, payload);

      return response.status(200).json({
        resolved: 'success',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        resolved: 'failure',
        message: 'Something went wrong.',
        error,
      });
    }
  };

  routes.delete = async (request, response) => {
    const _id = request.params._id;

    if (request.restrict && request.restrict !== _id)
      return response.status(401).json({
        resolved: 'failure',
        message: 'Unauthorized.',
      });

    try {
      await collection.deleteOne({ _id });

      return response.status(200).json({
        resolved: 'success',
      });
    } catch (error) {
      return response.status(500).json({
        resolved: 'failure',
        message: 'Something went wrong.',
        error,
      });
    }
  };

  return routes;
};
