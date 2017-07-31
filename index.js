'use strict';

let dns = require('dns');
let ping = require('ping');
let Promise = require('bluebird');
let pad = require('pad');
let request = require('request');
let fs = require('fs');

let domains = fs.readFileSync('domains.txt').toString().split("\n");

let debug = (msg) => { console.log(msg); };

function pingDomains(domains) {
    return new Promise((resolve, reject) => {
        if (domains.length == 0) { return resolve(); }

        let domain = domains.shift();

        debug('DNS lookup for '+domain);
        dns.lookup(domain, { family: 4 }, (error, ip, family) => {
            if (error) { return reject(error); }

            debug('Ping for '+ip);
            ping.sys.probe(ip, (isAlive) => {

                debug('Request for '+'http://'+domain);
                request('http://'+domain, (error2, response, body) => {
                    if (error2) { return reject(error2); }

                    console.log(pad(domain, 50)+' | '+pad(ip, 20)+' | '+pad((isAlive ? 'yes' : 'no'), 10)+' | '+pad(''+response.statusCode, 10));
                    return resolve(pingDomains(domains));
                });
            });
        });
    });
}

console.log(pad('Domain', 50)+' | '+pad('Ip', 20)+' | '+pad('Ping', 10)+' | '+pad('Status', 10));
console.log('-'.repeat(100));

pingDomains(domains)
    .then(() => {
        console.log('Done');
    });
