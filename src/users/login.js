const fetch = require('node-fetch');

const SHOT_BOT_URL = process.env.SHOT_BOT_URL;
const SHOT_BOT_EMAIL = process.env.SHOT_BOT_EMAIL;
const SHOT_BOT_PASSWORD = process.env.SHOT_BOT_PASSWORD;

const login = async () => {
  const payload = {
    email: SHOT_BOT_EMAIL,
    password: SHOT_BOT_PASSWORD,
  };

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${SHOT_BOT_URL}/users/login`, request);
  const body = await response.text();

  return getValidToken(JSON.parse(body));
};

const getValidToken = (body) => {
  return body.user.tokens[0].token;
};

module.exports = login;
