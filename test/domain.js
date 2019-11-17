'use strict';

const Punycode = require('punycode');

const Code = require('@hapi/code');
const Address = require('..');
const Lab = require('@hapi/lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('domain', () => {

    describe('analyze()', () => {

        it('identifies error', () => {

            const tests = [
                ['', 'Domain must be a non-empty string'],
                ['êiana.org', 'Domain contains forbidden Unicode characters', { allowUnicode: false }],
                ['abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz.com', 'Domain too long'],
                ['com', 'Domain lacks the minimum required number of segments'],
                ['x.no-such-tld', 'Domain uses forbidden TLD'],
                ['example..com', 'Domain contains empty dot-separated segment'],
                ['1234567890123456789012345678901234567890123456789012345678901234567890.com', 'Domain contains dot-separated segment that is too long'],
                ['example+.com', 'Domain contains invalid character', { tlds: false }],
                ['example.com_', 'Domain contains invalid tld character', { tlds: false }]
            ];

            for (let i = 0; i < tests.length; ++i) {
                const domain = tests[i];
                const output = Address.domain.analyze(domain[0], domain[2]);
                const result = domain[1];

                if (!output ||
                    output.error !== result) {

                    console.log(i, domain[0]);
                }

                expect(output.error).to.equal(result);
                expect(Address.errors[output.code]).to.equal(output.error);
            }
        });

        it('validates options', () => {

            const tests = [
                ['example.com', 'Invalid options: tlds must be a boolean or an object', { tlds: 1 }],
                ['example.com', 'Invalid options: tlds.allow must be a Set object or true', { tlds: { allow: ['test'] } }],
                ['example.com', 'Invalid options: tlds.deny must be a Set object', { tlds: { deny: ['test'] } }],
                ['example.com', 'Invalid options: cannot specify both tlds.allow and tlds.deny lists', { tlds: { allow: new Set(), deny: new Set() } }],
                [1, 'Invalid input: domain must be a string']
            ];

            for (let i = 0; i < tests.length; ++i) {
                const domain = tests[i];
                expect(() => Address.domain.analyze(domain[0], domain[2])).to.throw(domain[1]);
            }
        });
    });

    describe('isValid()', () => {

        it('validates domain', () => {

            const tests = [
                ['\r', false],
                ['test', false],
                ['@', false],
                ['iana.org', true],
                ['nominet.org.uk', true],
                ['about.museum', true],
                ['x.商務', true, { tlds: { allow: new Set([Punycode.toASCII('商務')]) } }],
                ['iana.123', false],
                ['255.255.255.255', false],
                ['XN--UNUP4Y', true, { minDomainSegments: 1 }],
                ['test@example.com', false],
                ['test:example.com', false],
                ['example.com:123', false],
                ['example.com/path', false]
            ];

            for (let i = 0; i < tests.length; ++i) {
                const domain = tests[i];
                const valid = Address.domain.isValid(domain[0], domain[2]);
                const result = domain[1];

                if (valid !== result) {
                    const outcome = Address.domain.analyze(domain[0], domain[2]);
                    if (outcome) {
                        console.log(i, domain[0], outcome.error);
                    }
                    else {
                        console.log(i, domain[0]);
                    }
                }

                expect(valid).to.equal(result);
            }
        });
    });
});
