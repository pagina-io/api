'use strict';

var IDENTITY_PROVIDERS = [ 'github' ];

module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var ObjectId = Schema.Types.ObjectId;
  var Schemas = {};

  var Timestamps = require('mongoose-timestamp');
  var URLSlugs = require('mongoose-url-slugs');
  var validator = require('validator');

  Schemas.Identity = new Schema({
    provider: { type: String, enum: IDENTITY_PROVIDERS, required: true },
    uid: { type: Number, required: true },
    profile: { type: Schema.Types.Mixed },
    token: { type: String, required: true }
  });

  Schemas.File = new Schema({
    filename: { type: String, required: true },
    repo: { type: ObjectId, ref: 'Repo', required: true }
  });

  Schemas.Repo = new Schema({
    owner: { type: ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    githubId: { type: Number, required: true },
    description: { type: String }
  });

  Schemas.User = new Schema({
    username: { type: String, required: true },
    email: { type: String, lowercase: true, validate: [validator.isEmail, 'invalid email'] },
    identity: Schemas.Identity,
    avatar: { type: String },
    scope: { type: Array, default: [ 'user' ] }
  });

  for (var s in Schemas) Schemas[s].plugin(Timestamps);

  return Schemas;
};
