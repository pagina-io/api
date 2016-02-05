'use strict';

module.exports = function(mongoose) {
  var Schemas = {};

  var Timestamps = require('mongoose-timestamp');
  var URLSlugs = require('mongoose-url-slugs');

  Schemas.User.plugin(URLSlugs('name', { field: 'slug' }));

  for (var s in Schemas) Schemas[s].plugin(Timestamps);

  return Schemas;
};
