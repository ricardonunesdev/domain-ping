'use strict';

let dns = require('dns');
let ping = require('ping');

let domains = require('./domains');

domains.forEach((domain) => {
    console.log('Domain: '+domain);
});