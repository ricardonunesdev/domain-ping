'use strict';

const Promise = require('bluebird');
const ping = require('ping');
const dns = require('dns');

const getDomainIp = (domain) => {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, { family: 4 }, (error, ip, family) => {
            if (error) {
                return resolve({ success: false, error: error });
            }
            return resolve({ success: true, ip: ip, family: family });
        });
    });
};

const pingIp = (ip) => {
    return new Promise((resolve, reject) => {
        ping.sys.probe(ip, (alive) => {
            return resolve({ success: true, alive: alive });
        });
    });
};

const domainPing = (domain) => {
    return new Promise((resolve, reject) => {
        let data = {
            success: null
        };

        getDomainIp(domain)
            .then((res) => {
                if (res.success) {
                    data.ip = res;
                    return pingIp(res.ip);
                } else {
                    data.success = false;
                    data.error = res.error;
                    return reject(data);
                }
            })
            .then((res) => {
                if (res.success) {
                    data.ping = res;
                    data.success = true;
                    return resolve(data);
                } else {
                    data.success = false;
                    data.error = res.error;
                    return reject(data);
                }
            })
            .catch((error) => {
                return reject({ success: false, error: error });
            });
    });
};

module.exports = domainPing;
