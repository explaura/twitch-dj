const fetch = require('node-fetch');

const SPOTIFY_URL = 'https://api.spotify.com';
const SPOTIFY_PLAYLIST_ID = '7nyIsdoLSm4gnXBFo7hNZC';

const addSongToPlaylist = async (spotifyUri) => {
  const request = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
    },
  };

  return fetch(
    `${SPOTIFY_URL}/v1/playlists/${SPOTIFY_PLAYLIST_ID}/tracks?uris=${spotifyUri}`,
    request
  );
};

const searchSong = async (song) => {
  const request = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
    },
  };

  const response = await fetch(
    `${SPOTIFY_URL}/v1/search?q=${song}&type=track&limit=1`,
    request
  );
  const body = await response.text();

  return extractSongUri(JSON.parse(body));
};

const extractSongUri = (body) => {
  return body.tracks.items[0].uri;
};

module.exports = {
  addSongToPlaylist,
  searchSong,
};
