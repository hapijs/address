'use strict';

const Url = require('url');

const errorsByCode = require('./errors').errorsByCode;


const internals = {
    minDomainSegments: 2,
    nonAsciiRx: /[^\x00-\x7f]/,
    domainControlRx: /[\x00-\x20]/,                                                     // Control + space
    tldSegmentRx: /^[a-zA-Z](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/,
    domainSegmentRx: /^[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/,
    URL: Url.URL || URL                                                                 // $lab:coverage:ignore$
};


exports.analyze = function (domain, options = {}) {

    if (typeof domain !== 'string') {
        throw new Error(errorsByCode.DOMAIN_BE_STRING);
    }

    if (!domain) {
        return { error: errorsByCode.DOMAIN_NON_EMPTY_STRING, code: 'DOMAIN_NON_EMPTY_STRING' };
    }

    if (domain.length > 256) {
        return { error: errorsByCode.DOMAIN_TOO_LONG, code: 'DOMAIN_TOO_LONG' };
    }

    const ascii = !internals.nonAsciiRx.test(domain);
    if (!ascii) {
        if (options.allowUnicode === false) {                                           // Defaults to true
            return { error: errorsByCode.DOMAIN_INVALID_UNICODE_CHARS, code: 'DOMAIN_INVALID_UNICODE_CHARS' };
        }

        domain = domain.normalize('NFC');
    }

    if (internals.domainControlRx.test(domain)) {
        return { error: errorsByCode.DOMAIN_INVALID_CHARS, code: 'DOMAIN_INVALID_CHARS' };
    }

    domain = internals.punycode(domain);

    // https://tools.ietf.org/html/rfc1035 section 2.3.1

    const minDomainSegments = options.minDomainSegments || internals.minDomainSegments;

    const segments = domain.split('.');
    if (segments.length < minDomainSegments) {
        return { error: errorsByCode.DOMAIN_SEGMENT, code: 'DOMAIN_SEGMENT' };
    }

    const tlds = options.tlds;
    if (tlds) {
        const tld = segments[segments.length - 1].toLowerCase();
        if (tlds.deny && tlds.deny.has(tld) ||
            tlds.allow && !tlds.allow.has(tld)) {

            return { error: errorsByCode.DOMAIN_FORBIDDEN_TLDS, code: 'DOMAIN_FORBIDDEN_TLDS' };
        }
    }

    for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];

        if (!segment.length) {
            return { error: errorsByCode.DOMAIN_EMPTY_SEGMENT, code: 'DOMAIN_EMPTY_SEGMENT' };
        }

        if (segment.length > 63) {
            return { error: errorsByCode.DOMAIN_DOTS_SEGMENT, code: 'DOMAIN_DOTS_SEGMENT' };
        }

        if (i < segments.length - 1) {
            if (!internals.domainSegmentRx.test(segment)) {
                return { error: errorsByCode.DOMAIN_INVALID_CHARS, code: 'DOMAIN_INVALID_CHARS' };
            }
        }
        else {
            if (!internals.tldSegmentRx.test(segment)) {
                return { error: errorsByCode.DOMAIN_INVALID_TLDS_CHARS, code: 'DOMAIN_INVALID_TLDS_CHARS' };
            }
        }
    }

    return null;
};


exports.isValid = function (domain, options) {

    return !exports.analyze(domain, options);
};


internals.punycode = function (domain) {

    try {
        return new internals.URL(`http://${domain}`).host;
    }
    catch (err) {
        return domain;
    }
};
