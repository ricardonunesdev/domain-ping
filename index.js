'use strict';

const domainPing = require('./domain-ping');

domainPing('github.com')
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });
