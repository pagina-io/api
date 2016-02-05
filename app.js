'use strict';

if (!process.env.PORT) require('dotenv').load();

var glob = require('glob');
var Phobos = require('phobosjs');
var passport = require('passport');

var phobos = new Phobos({
  port: process.env.PORT || 9292,
  dbUri: process.env.MONGO_URI,
  bearerTokenSignature: process.env.BEARER_SIGNATURE
});

phobos.addSchema(require('./config/schema'));
phobos.addScopes(require('./config/scopes'));

var DS = phobos.initDb();

var controllers = glob.sync('./controllers/*');

for (var i = 0; i < controllers.length; i++) {
  phobos.addController(require(controllers[i]));
}

phobos.server.get('/', function(req, res, next) {
  res.send({
    api: process.env.APP_NAME,
    version: require('./package.json').version,
    framework: require('phobosjs/package.json').version
  });
});

// Let's start up our server!
phobos.start();

phobos.server.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(require('./strategies/github')(DS));

require('./routes/auth')(phobos, DS, passport);

phobos.mountErrorHandler(require('./routes/errors')(phobos, DS));
