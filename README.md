# DigitalOcean-Droplet-SDK

[![Build Status](https://travis-ci.org/GeekyAubergine/digitalocean-droplet-sdk.svg?branch=develop)](https://travis-ci.org/GeekyAubergine/digitalocean-droplet-sdk)
[![Coverage Status](https://coveralls.io/repos/github/GeekyAubergine/digitalocean-droplet-sdk/badge.svg)](https://coveralls.io/github/GeekyAubergine/digitalocean-droplet-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/geekyaubergine/digitalocean-droplet-sdk/badge.svg)](https://snyk.io/test/github/geekyaubergine/digitalocean-droplet-sdk)

A simple interface to get metadata about a DigitalOcean Droplet.

## Install

    npm install digitalocean-droplet-sdk --save
    
    
## Usage

DigitalOcean-Droplet-SDK was designed to provide a simple and easy to use interface to get metadata about the droplet that it is running on.

```js
var dropletSDK = require('digitalocean-droplet-sdk');

dropletSDK.getMetadata().then(function(metadata) { 
	/* do something with the result */
}).catch(function() {
	/* error :( */
})
```
