const passport = require('passport');
const { onSuccess, onFail } = require('../utils/formatResponse');

const redirectUser = (req, res) => res.redirect('/');

const sendUserInfo = (req, res) => {
  // if user logged in oauth
  if (req.user) res.json(onSuccess(req.user));
  // if user not logged in
  else res.json(onFail('user not logged in'));
}

module.exports = app => {
  
  /** Google */
  app.get('/auth/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }));
  app.get('/auth/google/callback', passport.authenticate('google'), redirectUser);

  /** Facebook */
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook'), redirectUser);

  /** Kakao */
  app.get('/auth/kakao', passport.authenticate('kakao'));
  app.get('/auth/kakao/callback', passport.authenticate('kakao'), redirectUser);

  /** Naver */
  app.get('/auth/naver', passport.authenticate('naver'));
  app.get('/auth/naver/callback', passport.authenticate('naver'), redirectUser);

  /** Get current user info */
  app.get('/auth/current_user', sendUserInfo);

  /** Logout */
  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
}