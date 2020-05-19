# Twitch DJ

## Overview
A server-side application which adds songs to a Spotify playlist. Currently the bot actions are:
- `!help` - returns a list of bot commands
- `!song` - send an API request to add a song to a Spotify playlist

## Pre-requisites

### NodeJS & npm
Current versions used: `npm 6.13.4` & `node.js 12.16.1`

Install with [nvm](https://github.com/creationix/nvm)

### Twitch OAuth token
To generate an OAuth token (used for authorising bot to access your Twitch channel), [visit here](https://twitchapps.com/tmi/). 

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

## Running locally

To spin up the local service, run:
```bash
make start
```
