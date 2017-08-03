'use strict';

let dns = require('dns');
let ping = require('ping');
let Promise = require('bluebird');
let request = require('request');
let fs = require('fs');

let uniq = (arr) => { return Array.from(new Set(arr)); };
let ouputData = (data) => { console.log(data.domain+"\t"+data.ip+"\t"+data.ping+"\t"+data.status); };
let debug = (msg) => { console.log(msg); };

let domains = uniq(fs.readFileSync('domains.txt').toString().split("\n"));

let pingDomain = (data) => {
    return new Promise((resolve, reject) => {
        if (data.tries >= 5) {
            ouputData(data);
            return resolve();
        }

        data.tries++;

        dns.lookup(data.domain, { family: 4 }, (error1, ip, family) => {
            if (error1) {
                data.ip = 'failed';
                return resolve(pingDomain(data));
            }

            data.ip = ip;

            ping.sys.probe(data.ip, (isAlive) => {

                data.ping = (isAlive ? 'yes' : 'no');

                // TODO: Beautify duplicate code

                request('http://'+data.domain, (error2, response, body) => {
                    if (error2) {
                        request('https://'+data.domain, (error3, response, body) => {
                            if (error3) {
                                data.status = 'failed';
                                ouputData(data);
                                return resolve();
                            }

                            data.status = response.statusCode;
                            ouputData(data);
                            return resolve();
                        });
                    } else {
                        data.status = response.statusCode;
                        ouputData(data);
                        return resolve();
                    }
                });
            });
        });
    });
};

debug('Pinging '+domains.length+' domain(s)'+"\n");

Promise.map(domains, (domain) => {
        if (domain && (typeof domain === 'string') && (domain.length > 0)) {
            let data = { domain: domain, ip: '', ping: '', status: '', tries: 0 };
            return pingDomain(data);
        }
    })
    .then(() => {
        debug("\n"+'Done');
    });
