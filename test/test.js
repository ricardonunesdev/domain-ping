'use strict';

const chai = require('chai');
const expect = chai.expect;

const domainPing = require('../domain-ping');

describe('Domain ping', () => {
    it('should return error for empty domain', (done) => {
        domainPing('')
            .then((res) => {
                done(Error('Expected to fail'));
            })
            .catch((res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.property('success');
                expect(res.success).to.be.false;
                expect(res).to.have.property('error');
                expect(res.error).to.have.property('message');
                expect(res.error.message).to.be.a('string');
                expect(res.error.message).to.be.equal('Invalid domain name');
                done();
            })
            .catch(done);
    });
});
