'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('email', () => {

    it('available as direct require', () => {

        expect(require('../lib/email').isValid('test@example.com')).to.be.true();
    });
});

describe('domain', () => {

    it('available as direct require', () => {

        expect(require('../lib/domain').isValid('example.com')).to.be.true();
    });
});
