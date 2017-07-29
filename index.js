'use strict';

let dns = require('dns');
let ping = require('ping');
let Promise = require('bluebird');
let pad = require('pad');

let domains = require('./domains');

function pingDomain(domain) {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, (error, ip, family) => {
            if (error) { return reject(error); }
            ping.sys.probe(ip, (isAlive) => {
                console.log(pad(ip, 15)+' - '+pad((isAlive ? 'up' : 'maybe down'), 10)+' - '+domain);
                return resolve();
            });
        });
    });
}

Promise.map(domains, (domain) => {
        return pingDomain(domain);
    })
    .then(() => {
        console.log('Done');
    });
