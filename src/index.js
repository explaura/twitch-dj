const tmi = require('tmi.js');
const express = require('express');
const { parse } = require('path');
const { createLogger } = require('bunyan');
const login = require('./users/login');
const logout = require('./users/logout');

const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const STREAMER_CHANNEL = process.env.STREAMER_CHANNEL;
const HELP_COMMAND = '!help';
const SONG_REQUEST_COMMAND = '!song';
const PORT = process.env.PORT || 3002;

const PLAYLIST_SCOPES = 'playlist-modify-public playlist-modify-private';

const logger = createLogger({
  name: parse(__filename).name,
  level: process.env.LOG_LEVEL || 'info',
});

const app = express();
app.listen(PORT, () => {
  logger.info({
    message: `listening on ${PORT}`,
  });
});

let token;
const client = new tmi.Client({
  options: {
    debug: true,
  },
  connection: {
    port: PORT,
    secure: true,
    reconnect: true,
  },
  identity: {
    username: 'simpmasta-3000',
    password: OAUTH_TOKEN,
  },
  channels: [STREAMER_CHANNEL],
});

client.connect();

client.on('connected', async () => {
  logger.info({
    message: 'connected to twitch',
  });

  try {
    // TODO: connect to spotify?
    token = await login();
    logger.info({
      token,
      message: 'connected to spotify',
    });
    return token;
  } catch (err) {
    logger.info({
      err,
      message: 'failed to connect to spotify',
    });
    throw err;
  }
});

client.on('message', async (channel, tags, message, self) => {
  // ignore echoed messages
  if (self) return;

  if (message.toLowerCase() === HELP_COMMAND) {
    try {
      return await client.say(
        channel,
        `@${tags.username}, use the command !shots to pour ${STREAMER_CHANNEL} a shot`
      );
    } catch (err) {
      await client.say(channel, `@${tags.username}, failed to provide help :(`);
      logger.err({
        err,
        message: `failed to handle ${HELP_COMMAND} command`,
      });
      return err;
    }
  } else if (message.toLowerCase() === SONG_REQUEST_COMMAND) {
    try {
      // TODO: queue song on spotify

      return await client.say(
        channel,
        `@${tags.username} is pouring ${STREAMER_CHANNEL} a shot`
      );
    } catch (err) {
      await client.say(
        channel,
        `@${tags.username}, failed to pour ${STREAMER_CHANNEL} a shot :(`
      );
      logger.err({
        err,
        message: `failed to handle ${SONG_REQUEST_COMMAND} command`,
      });
      return err;
    }
  }
});

client.on('disconnected', async () => {
  logger.info({
    message: 'disconnected from twitch',
  });

  try {
    return await logout(token);
  } catch (err) {
    logger.info({
      err,
      message: 'failed to logout of shot bot',
    });
    throw err;
  }
});
