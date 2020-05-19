const fetch = require('node-fetch');

const SPOTIFY_URL = 'https://api.spotify.com';
const SPOTIFY_PLAYLIST_ID = '5QW77qb2zrR1pxfzbxqoUw';
const SPOTIFY_URI = 'spotify:track:4677jRCDMa05jcA94EQ0hG';

const addSongToPlaylist = async (token) => {
  const request = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(
    `${SPOTIFY_URL}/v1/playlists/${SPOTIFY_PLAYLIST_ID}/tracks?uris=${SPOTIFY_URI}`,
    request
  );
};

module.exports = addSongToPlaylist;
