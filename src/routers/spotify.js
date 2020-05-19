const express = require('express');
const passport = require('passport');
const { parse } = require('path');
const { createLogger } = require('bunyan');
const SpotifyStrategy = require('passport-spotify').Strategy;

const logger = createLogger({
  name: parse(__filename).name,
  level: process.env.LOG_LEVEL || 'info',
});

const PORT = process.env.PORT || 3002;
const PLAYLIST_SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-email',
  'user-read-private',
];

const router = express.Router();

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/callback`,
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      logger.info({
        accessToken,
        refreshToken,
        expires_in,
        profile,
        message: 'successfully logged into spotify',
      });
      return done();
    }
  )
);

router.get(
  '/auth/spotify',
  passport.authenticate(
    'spotify',
    {
      scope: PLAYLIST_SCOPES,
      showDialog: true,
    },
    (req, res) => {
      logger.info({
        req,
        res,
        message: 'authenticating to spotify',
      });
    }
  )
);

router.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }, () => {
    logger.info({
      message: 'successful authentication, redirecting home',
    });
  })
);

module.exports = router;
