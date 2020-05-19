const tmi = require('tmi.js');
const { parse } = require('path');
const { createLogger } = require('bunyan');
const express = require('express');
const spotifyRouter = require('./routers/spotify');
const addSongToPlaylist = require('./services/spotify');

const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const STREAMER_CHANNEL = process.env.STREAMER_CHANNEL;
const HELP_COMMAND = '!help';
const SONG_REQUEST_COMMAND = '!song';
const PORT = process.env.PORT || 3002;

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
        `@${tags.username}, use the command !song {your song here} to add a song to the playlist`
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
      const res = await addSongToPlaylist(
        // eslint-disable-next-line max-len
        'BQA-OeXTh7kcnmbCGSABYuSczEYHWFyqQmFCWFyxGpt0Ez-r16-cHBp8rp0Dl8iGQhIpvRHpn_OSo8g4ysjCpDWn_iz13UXbC8umJRpNjCsYnae3WZROGRvk4I_BhdN9BISW6GhtA0v_i5OzaLUUeTGkLklASkZ_FTyHD0taRwquwkjj8bJo60z5lj5znsuaemktjjTalQ'
      );

      logger.info({
        res,
        message: 'requested song on spotify',
      });

      return await client.say(
        channel,
        `@${tags.username} your song has been added to the playlist`
      );
    } catch (err) {
      await client.say(
        channel,
        `@${tags.username}, failed to add your song to the playlist :(`
      );
      logger.err({
        err,
        message: `failed to handle ${SONG_REQUEST_COMMAND} command`,
      });
      return err;
    }
  }
});
