'use strict';

var GithubStrategy = require('passport-github').Strategy;

module.exports = function(DS) {

  var Credentials = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URI,
    passReqToCallback: true,
    scope: 'user,repo',
    userAgent: process.env.APP_NAME
  };

  function Strategy(req, accessToken, refreshToken, profile, done) {
    if (!accessToken || !profile) return done(false);

    var query = DS.User.findOne({ 'identity.uid': parseInt(profile.id) });

    query.exec(function(err, user) {
      if (err) return done(err);

      if (user) {
        return done(err, user);
      } else {
        var Identity = new DS.Identity({
          uid: parseInt(profile.id),
          provider: 'github',
          token: accessToken,
          profile: profile._json
        });

        var User = new DS.User({
          identity: Identity,
          avatar: profile.photos[0].value,
          username: profile.username,
          email: profile.emails[0].value
        });

        User.save(function(err) {
          if (err) return done(err);

          return done(err, User);
        });
      }
    });
  };

  return new GithubStrategy(Credentials, Strategy);
};
