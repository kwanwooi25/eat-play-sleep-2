/** Passport */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

/** Random ID Generator */
const randomId = require('../utils/generateRandomID');

/** Database */
const db = require('../database');

/** Configs */
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}
const facebookConfig = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'email']
}
const kakaoConfig = {
  clientID: process.env.KAKAO_APP_ID,
  clientSecret: '',
  callbackURL: '/auth/kakao/callback'
}
const naverConfig = {
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: '/auth/naver/callback'
}

/**
 * ::: Oauth user login :::
 * find and return existing user,
 * create and return new user otherwise
 */
const findOrCreateUser = (accessToken, refreshToken, profile, done) => {
  const { provider, id } = profile;

  return db('users')
    .where(`${provider}_id`, '=', id)
    .then(user => {
      /**
       * when the user exists,
       * return user info
       */
      if (user.length) {
        return done(null, user[0]);
      /**
       * when user doesn't exist,
       * create new user and return the info
       */
      } else {
        const newUser = {
          id: randomId(),
          provider: provider,
          [`${provider}_id`]: id,
          settings: {},
        }

        return db('users')
          .insert(newUser)
          .returning('*')
          .then(user => done(null, user[0]))
      }
    })
    .catch(error => done(null, false, error));;
}
  
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db('users')
    .where('id', '=', id)
    .then(user => done(null, user[0]));
});

passport.use(new GoogleStrategy(googleConfig, findOrCreateUser));
passport.use(new FacebookStrategy(facebookConfig, findOrCreateUser));
passport.use(new KakaoStrategy(kakaoConfig, findOrCreateUser));
passport.use(new NaverStrategy(naverConfig, findOrCreateUser));

module.exports = passport;