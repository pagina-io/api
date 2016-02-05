'use strict';

module.exports = function(Phobos, DS, passport) {

  var githubCallback = function(req, res, next) {
    if (!req.user) return res.redirect(process.env.FRONTEND + '?error=app_not_accepted');

    var payload = req.user._id;
    var token = Phobos.token.generate(payload);
    var uri = '/callback?access_token=' + token;

    uri += '&username=' + req.user.username;
    uri += '&user_id=' + req.user._id;

    return res.redirect(process.env.FRONTEND + uri);
  };

  Phobos.server.get(
    '/auth/github',
    passport.authenticate('github', {})
  );

  Phobos.server.get(
    '/auth/github/callback',
    passport.authenticate('github', {}),
    githubCallback
  );

};
