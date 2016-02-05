'use strict';

module.exports = function(Phobos, DS) {

  var toTranslationKey = function(message) {
    return message.toLowerCase().split(' ').join('_');
  };

  var handleError = function(err, req, res, next) {
    var response = {
      errors: [],
      status: 'error'
    };

    var statusCode = 500;

    if (err.stack && err.stack.indexOf('MongooseError') > -1) {
      // This is a mongoose error
      for (var f in err.errors) {
        response.errors.push({
          translation: 'api.error.' + Inflector.underscore(Inflector.pluralize(req.controller.model)) + '.' + toTranslationKey(err.errors[f].path),
          message: err.errors[f].message,
          status: statusCode.toString()
        });
      }
    } else if (err.stack && err.stack.indexOf('CastError') > -1) {
      // This is a mongoose typecasting error
      response.errors.push({
        translation: 'api.error.' + Inflector.underscore(Inflector.pluralize(req.controller.model)) + '.' + toTranslationKey(err.path),
        message: err.message,
        status: statusCode.toString()
      });
    } else if (err.stack && (err.stack.indexOf('JWT') > -1 || err.stack.indexOf('auth') > -1)) {
      // Manually caught bearer token error
      statusCode = 401;

      response.errors.push({
        translation: err.translation,
        message: err.message,
        status: statusCode.toString()
      });
    } else if (err.name && (err.name.indexOf('JsonWebTokenError') > -1 || err.name.indexOf('TokenExpiredError') > -1)) {
      // JsonWebToken error message
      statusCode = 401;

      response.errors.push({
        translation: 'api.error.auth.' + toTranslationKey(err.message),
        message: err.message,
        status: statusCode.toString()
      });
    } else if (err.name && err.name === 'auth') {
      // Authentication error
      statusCode = 401;

      response.errors.push({
        translation: err.translation || 'api.error.auth.' + toTranslationKey(err.message),
        message: err.message,
        status: statusCode.toString()
      });
    } else if (typeof err === 'string' && err === 'Incorrect format') {
      // Image upload in the wrong format
      statusCode = 415;

      response.errors.push({
        translation: 'api.error.upload.' + toTranslationKey(err),
        message: err,
        status: statusCode.toString()
      });
    } else if (typeof err === 'string') {
      response.errors.push({
        translation: 'api.error.miscellaneous',
        message: err,
        status: statusCode.toString()
      });
    } else if (typeof err === 'object' && err.translation && err.message) {
      response.errors.push({
        translation: err.translation,
        message: err.message,
        status: statusCode.toString()
      });
    } else {
      // Don't know what to do with this one!
      response.errors.push({
        translation: 'api.error.miscellaneous',
        message: 'An unknown error occurred - check the logbarf',
        status: statusCode.toString()
      });
    }

    console.log(err);
    return res.status(statusCode).send(response);
  };

  return handleError;

};
