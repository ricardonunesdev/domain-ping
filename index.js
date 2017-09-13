'use strict';

const Promise = require('bluebird');
const ping = require('ping');
const dns = require('dns');

const getDomainIp = (domain) => {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, { family: 4 }, (error, ip, family) => {
            if (error) {
                return resolve({ success: false, error: error.message });
            }
            return resolve({ success: true, ip: ip });
        });
    });
};

const domainPing = (domain) => {
    return new Promise((resolve, reject) => {
        getDomainIp(domain)
            .then((res) => {
                return resolve(res);
            })
            .catch((error) => {
                return reject({ success: false, error: error.message });
            });
    });
};

module.exports = domainPing;
