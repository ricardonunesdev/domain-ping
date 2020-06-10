'use strict';

const Promise = require('bluebird');
const ping = require('ping');
const request = require('request');
const isValidDomain = require('is-valid-domain');

const dns = require('dns');

const debug = require('debug')('domain-ping');
const debugErr = require('debug')('domain-ping:error');

const PING_TIMEOUT = 10;

const getDomainIp = (domain) => {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, { family: 4 }, (error, ip, family) => {
            if (error) {
                return reject(error);
            }
            return resolve(ip);
        });
    });
};

const pingIp = (ip, timeout) => {
    return new Promise((resolve, reject) => {
		ping.promise.probe(ip, { timeout: timeout })
			.then((res) => {
				let data = {
					alive: res.alive,
					time: parseFloat(res.avg) || null
				};
				return resolve(data);
			});
    });
};

const requestUrl = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                return reject(error);
            }
            return resolve(response.statusCode);
        });
    });
};

const requestDomain = (domain) => {
    return new Promise((resolve, reject) => {
        requestUrl('http://' + domain)
            .then(resolve)
            .catch((error) => {
                return requestUrl('https://' + domain);
            })
            .then(resolve)
            .catch(reject);
    });
};

const domainPing = (domain) => {
    return new Promise((resolve, reject) => {
        let data = {
            domain: domain
        };

        if (!isValidDomain(domain)) {
            data.success = false;
            data.error = 'invalid domain name "' + domain + '"';
            debugErr(data.error);
            return reject(data);
        }

        getDomainIp(domain)
            .then((ip) => {
                data.ip = ip;
                return pingIp(ip, PING_TIMEOUT);
            })
            .then((pingRes) => {
				data.ping = pingRes.alive || false;
				if (pingRes.alive) { data.ping_time = pingRes.time; }
                return requestDomain(domain);
            })
            .then((statusCode) => {
                data.success = true;
                data.online = (statusCode === 200);
                data.statusCode = statusCode;
                debug(data);
                return resolve(data);
            })
            .catch((error) => {
                data.success = false;
                data.error = error.message;
                debugErr(data.error);
                return reject(data);
            });
    });
};

module.exports = domainPing;
