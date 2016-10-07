# DigitalOcean-Droplet-SDK

[![Build Status](https://travis-ci.org/GeekyAubergine/digitalocean-droplet-sdk.svg?branch=develop)](https://travis-ci.org/GeekyAubergine/digitalocean-droplet-sdk)
[![Coverage Status](https://coveralls.io/repos/github/GeekyAubergine/digitalocean-droplet-sdk/badge.svg?branch=master)](https://coveralls.io/github/GeekyAubergine/digitalocean-droplet-sdk?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/geekyaubergine/digitalocean-droplet-sdk/badge.svg)](https://snyk.io/test/github/geekyaubergine/digitalocean-droplet-sdk)

A simple interface to get metadata about a DigitalOcean Droplet.

## Install
    npm install digitalocean-droplet-sdk --save

## Usage
DigitalOcean-Droplet-SDK was designed to provide a simple and easy to use interface to get metadata about the droplet that it is running on. You can chose to either request the entire metadata for a droplet, or specific values from the metadata.

### Request all metadata
```js
var dropletSDK = require('digitalocean-droplet-sdk');

dropletSDK.getMetadata().then(function(metadata) {
	/* do something with the result */
}).catch(function() {
	/* error :( */
})
```

### Request IPv4 Private IP Addresses
```js
var dropletSDK = require('digitalocean-droplet-sdk');

dropletSDK.getPrivateIP4Addresses().then(function(ipAddresses) {
	/* do something with the result */
}).catch(function() {
	/* error :( */
})
```

### All available methods
| Function | Description | Type |
| --- | --- | --- |
| getMetadata() | Returns all the metadata for the droplet [see the DigitalOcean guides for more](https://developers.digitalocean.com/documentation/metadata/) | JSON |
| getID() | Returns the id of the droplet | Number |
| getVendorData() | Returns the vendor data about the droplet | String |
| getAuthKey() | Returns the Auth Key | String |
| getHostName() | Returns the hostname/name of the droplet | String |
| getName() | Returns the hostname/name of the droplet | String |
| getPublicKeys | List of public ssh keys that have been added to the droplet | ```Array<String>``` |
| getRegion() | Returns the region of the droplet | String |
| getInterfaces() | Returns both the public and private interfaces for the droplet. This is in the form of an object with two values; 'public' and 'private' which in turn contain arrays of respective interfaces (see format below) | JSON |
| getPrivateInterfaces() | Returns an array of the private interfaces for the droplet (see format below) | JSON |
| getPrivateIP4Addresses() | Returns an array of the private ipv4 addresses as strings | ```Array<String>``` |
| getPrivateIP6Addresses() | Returns an array of the private ipv6 addresses as strings | ```Array<String>``` |
| getPrivateMacAddresses() | Returns an array of the private MAC addresses as strings | ```Array<String>``` |
| getPublicInterfaces() | Returns an array of the public interfaces for the droplet (see format below) | JSON |
| getPublicIP4Addresses() | Returns an array of the public ipv4 addresses as strings | ```Array<String>``` |
| getPublicIP6Addresses() | Returns an array of the public ipv6 addresses as strings | ```Array<String>``` |
| getPublicMacAddresses() | Returns an array of the public MAC addresses as strings | ```Array<String>``` |
| hasFloatingIP() | Returns whether or not the droplet has a floating ip | Boolean |
| getFloatingIP() | Returns a string representation of the droplet floating ip if it has one, if it does not it will return a string of length 0 | String |
| getDNS() | Returns an array of strings of the name servers for this droplet | ```Array<String>``` |
| getNameServers() | Returns an array of strings of the name servers for this droplet | ```Array<String>``` |
| getTags() | Returns an array of strings of the tags for this droplet | ```Array<String>``` |
If you feel there are any missing methods please create an issue for it on GitHub.

###### Example Of Interface JSON
```js
{
  'ipv4':{
    'ip_address':'10.132.255.114',
    'netmask':'255.255.0.0',
    'gateway':'10.132.0.1',
  },
  'ipv6':{
    'ip_address':'2604:A880:0800:0010:0000:0000:017D:2001',
    'cidr':64,
    'gateway':'2604:A880:0800:0010:0000:0000:0000:0001',
  },
  'mac':'04:01:2a:0f:2a:02',
  'type':'private',
}
```
