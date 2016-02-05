'use strict';

var Github = require('github');
var github = new Github({
  version: '3.0.0',
  host: 'api.github.com',
  headers: { 'user-agent': process.env.APP_NAME }
});

module.exports = {
  
};
