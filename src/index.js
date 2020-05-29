const tmi = require('tmi.js');
const { parse } = require('path');
const { createLogger } = require('bunyan');
const express = require('express');
const spotifyRouter = require('./routers/spotify');
const { addSongToPlaylist, searchSong } = require('./services/spotify');

const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const STREAMER_CHANNEL = process.env.STREAMER_CHANNEL;
const PORT = process.env.PORT || 3002;
const SPOTIFY_PLAYLIST =
  'https://open.spotify.com/playlist/7nyIsdoLSm4gnXBFo7hNZC?si=vs9KYML6SN6eOdSaHmRFnA';

// Twitch commands
const HELP_COMMAND = '!help';
const SONG_REQUEST_COMMAND = '!song';
const PLAYLIST_COMMAND = '!playlist';

const logger = createLogger({
  name: parse(__filename).name,
  level: process.env.LOG_LEVEL || 'info',
});

const app = express();

app.use(express.json());
app.use(spotifyRouter);
app.listen(PORT, () => {
  logger.info({
    message: `listening on ${PORT}`,
  });
});

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
});

client.on('message', async (channel, tags, message, self) => {
  // ignore echoed messages
  if (self) return;

  if (message.toLowerCase() === HELP_COMMAND) {
    try {
      return await client.say(
        channel,
        `@${tags.username} use the command !song {your song here} to add a song to the playlist`
      );
    } catch (err) {
      await client.say(channel, `@${tags.username} failed to provide help :(`);
      logger.error({
        err,
        message: `failed to handle ${HELP_COMMAND} command`,
      });
      return err;
    }
  } else if (message.toLowerCase().startsWith(SONG_REQUEST_COMMAND)) {
    try {
      const songRequest = message.replace(`${SONG_REQUEST_COMMAND} `, '');
      const songUri = await searchSong(songRequest);

      const res = await addSongToPlaylist(songUri);
      logger.info({
        res,
        songUri,
        message: 'added song to playlist',
      });

      return await client.say(
        channel,
        `@${tags.username} your song has been added to the playlist`
      );
    } catch (err) {
      await client.say(
        channel,
        `@${tags.username} failed to add your song to the playlist :(`
      );
      logger.error({
        err,
        message: `failed to handle ${SONG_REQUEST_COMMAND} command`,
      });
      return err;
    }
  } else if (message.toLowerCase() === PLAYLIST_COMMAND) {
    try {
      return await client.say(
        channel,
        `@${tags.username} access the playlist here: ${SPOTIFY_PLAYLIST}`
      );
    } catch (err) {
      await client.say(channel, `@${tags.username} failed to get the playlist`);
      logger.error({
        err,
        message: `failed to handle ${SPOTIFY_PLAYLIST} command`,
      });
      return err;
    }
  }
});
