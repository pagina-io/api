'use strict';

module.exports = {
  Repo: {
    read: true,

    edit: {
      '*': false,
      owner: true,
      admin: true
    },

    create: {
      '*': true,
      user: true,
      admin: true
    },

    delete: {
      '*': false,
      admin: true,
      owner: true
    },

    owners: [ 'owner' ],
    searchableBy: [ '_id', 'owner', 'name' ]
  },

  File: {
    read: true,

    edit: {
      '*': false,
      owner: true,
      admin: true
    },

    create: {
      '*': true,
      user: true,
      admin: true
    },

    delete: {
      '*': false,
      admin: true,
      owner: true
    },

    owners: [ 'owner' ],
    searchableBy: [ '_id', 'repo', 'owner', 'filename' ]
  },

  User: {
    read: {
      admin: true,
      owner: true,
      '*': [ 'username', 'slug', 'avatar' ]
    },

    edit: {
      '*': false,
      admin: true,
      owner: [ 'avatar', 'password', 'username', 'email' ]
    },

    create: {
      '*': true,
      admin: true
    },

    delete: {
      '*': false,
      admin: true,
      owner: false
    },

    owners: [ '_id' ],
    searchableBy: [ '_id', 'username' ]
  }
};
