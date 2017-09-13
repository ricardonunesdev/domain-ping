'use strict';

const domainPing = require('./index');

domainPing('github.com')
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });
