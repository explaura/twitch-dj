# Twitch Bot

## Overview
A server-side application which listens for bot commands. Currently the bot actions are:
- `!help` - returns a list of bot commands
- `!shots` - send an API request to a server on a microcontroller and pours a shot

## Pre-requisites

### NodeJS & npm
Current versions used: `npm 6.13.4` & `node.js 12.16.1`

Install with [nvm](https://github.com/creationix/nvm)

### Twitch OAuth token
To generate an OAuth token (used for authorising bot to access your Twitch channel), [visit here](https://twitchapps.com/tmi/). 

### Heroku CLI
Heroku can be used to host the bot. CLI commands can be used to retrieve logs, deploy from local, etc. To install:
```
brew tap heroku/brew && brew install heroku
```

## Dependencies
To install NPM dependencies:

```bash
npm install
```

## Linting
To ensure the linting of Typescript files, run:

```bash
npm run lint
```

## Deploying
If using Heroku to host, a git hook within Heroku can be configured so every push to your branch will deploy.

To login to Heroku:
```
heroku login
```

To view server logs, run:
```
heroku logs -a {app-name-here}
```

## Running locally
First ensure you have the environment variables populated in `.env` file before running. These can be retrieved from SSM.

To spin up the local service, run:
```bash
make start
```
