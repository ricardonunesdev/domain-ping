'use strict';

let dns = require('dns');
let ping = require('ping');
let Promise = require('bluebird');

let domains = require('./domains');

function pingDomain(domain) {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, (error, ip, family) => {
            if (error) { return reject(error); }
            ping.sys.probe(ip, (isAlive) => {
                console.log(domain+' - '+ip+' - '+(isAlive ? 'up' : 'down'));
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
