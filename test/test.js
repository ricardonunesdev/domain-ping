'use strict';

const expect = require('chai').expect;

const domainPing = require('../domain-ping');

describe('Testing domain-ping', () => {

    describe('Basic errors', () => {

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

        it('should return error for invalid domain', (done) => {
            domainPing('abc123')
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

    describe('Valid domains', () => {

        it('should return correct data for google.com', (done) => {
            domainPing('google.com')
                .then((res) => {
                    console.log(res);
                    expect(res).to.be.an('object');
                    expect(res).to.have.property('success');
                    expect(res.success).to.be.true;
                    expect(res).to.have.property('ip');
                    expect(res.ip).to.be.a('string');
                    expect(res).to.have.property('ping');
                    expect(res.ping).to.be.a('boolean');
                    expect(res.ping).to.be.true;
                    expect(res).to.have.property('online');
                    expect(res.online).to.be.a('boolean');
                    expect(res.online).to.be.true;
                    expect(res).to.have.property('statusCode');
                    expect(res.statusCode).to.be.a('number');
                    expect(res.statusCode).to.be.equal(200);
                    done();
                })
                .catch(done);
        });

        it('should return correct data for netflix.com (no ping)', (done) => {
            domainPing('netflix.com')
                .then((res) => {
                    expect(res).to.be.an('object');
                    expect(res).to.have.property('success');
                    expect(res.success).to.be.true;
                    expect(res).to.have.property('ip');
                    expect(res.ip).to.be.a('string');
                    expect(res).to.have.property('ping');
                    expect(res.ping).to.be.a('boolean');
                    expect(res.ping).to.be.false; // Firewall blocking ICMP
                    expect(res).to.have.property('online');
                    expect(res.online).to.be.a('boolean');
                    expect(res.online).to.be.true;
                    expect(res).to.have.property('statusCode');
                    expect(res.statusCode).to.be.a('number');
                    expect(res.statusCode).to.be.equal(200);
                    done();
                })
                .catch(done);
        });

    });

});
