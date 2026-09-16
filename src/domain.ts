import * as Url from 'url';

import { errorCode } from './errors';

const MIN_DOMAIN_SEGMENTS = 2;
const NON_ASCII_RX = /[^\x00-\x7f]/;
const DOMAIN_CONTROL_RX = /[\x00-\x20@\:\/\\#!\$&\'\(\)\*\+,;=\?]/; // Control + space + separators
const DOMAIN_CONTROL_NO_FORWARD_SLASH_RX = /[\x00-\x20@\:\\#!\$&\'\(\)\*\+,;=\?]/; // Control + space + separators without /
const TLD_SEGMENT_RX = /^[a-zA-Z](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
const DOMAIN_SEGMENT_RX = /^[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
const DOMAIN_UNDERSCORE_SEGMENT_RX = /^[a-zA-Z0-9_](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
const DOMAIN_FORWARD_SLASH_SEGMENT_RX = /^[a-zA-Z0-9](?:[a-zA-Z0-9\-\/]*[a-zA-Z0-9])?$/;
const DOMAIN_UNDERSCORE_FORWARD_SLASH_SEGMENT_RX = /^[a-zA-Z0-9_](?:[a-zA-Z0-9\-\/]*[a-zA-Z0-9])?$/;
const URL_IMPL = Url.URL || URL; // $lab:coverage:ignore$

interface TldsAllow {
    readonly allow: Set<string>;
}

interface TldsDeny {
    readonly deny: Set<string>;
}

function isTldsAllow(tlds: any): tlds is TldsAllow {
    return !!tlds.allow;
}

export interface DomainOptions {
    /**
     * Determines whether Unicode characters are allowed.
     *
     * @default true
     */
    readonly allowUnicode?: boolean;

    /**
     * Determines whether underscore (_) characters are allowed.
     *
     * @default false
     */
    readonly allowUnderscore?: boolean;

    /**
     * Determines whether forward slash (/) characters are allowed.
     *
     * @default false
     */
    readonly allowForwardSlash?: boolean;

    /**
     * The maximum number of domain segments (e.g. `x.y.z` has 3 segments) allowed.
     *
     * @default Infinity
     */
    readonly maxDomainSegments?: number;

    /**
     * The minimum number of domain segments (e.g. `x.y.z` has 3 segments) required.
     *
     * @default 2
     */
    readonly minDomainSegments?: number;

    /**
     * Top-level-domain options
     *
     * @default true
     */
    readonly tlds?: TldsAllow | TldsDeny;

    /**
     * Allows passing fully qualified domain (ends with a period)
     *
     * @default false
     */
    readonly allowFullyQualified?: boolean;
}

export interface Analysis {
    /**
     * The reason validation failed.
     */
    error: string;

    /**
     * The error code.
     */
    code: string;
}

/**
 * Analyzes a string to verify it is a valid domain name.
 *
 * @param domain - the domain name to validate.
 * @param options - optional settings.
 *
 * @return - undefined when valid, otherwise an object with single error key with a string message value.
 */
export function analyzeDomain(domain: string, options: DomainOptions = {}): Analysis | null {
    if (!domain) {
        // Catch null / undefined
        return errorCode('DOMAIN_NON_EMPTY_STRING');
    }

    if (typeof domain !== 'string') {
        throw new Error('Invalid input: domain must be a string');
    }

    if (domain.length > 256) {
        return errorCode('DOMAIN_TOO_LONG');
    }

    const ascii = !NON_ASCII_RX.test(domain);
    if (!ascii) {
        if (options.allowUnicode === false) {
            // Defaults to true
            return errorCode('DOMAIN_INVALID_UNICODE_CHARS');
        }

        domain = domain.normalize('NFC');
    }

    const controlRx = options.allowForwardSlash ? DOMAIN_CONTROL_NO_FORWARD_SLASH_RX : DOMAIN_CONTROL_RX;
    if (controlRx.test(domain)) {
        return errorCode('DOMAIN_INVALID_CHARS');
    }

    domain = punycode(domain, options.allowForwardSlash);

    // https://tools.ietf.org/html/rfc1035 section 2.3.1

    if (options.allowFullyQualified && domain[domain.length - 1] === '.') {
        domain = domain.slice(0, -1);
    }

    const minDomainSegments = options.minDomainSegments || MIN_DOMAIN_SEGMENTS;

    const segments = domain.split('.');
    if (segments.length < minDomainSegments) {
        return errorCode('DOMAIN_SEGMENTS_COUNT');
    }

    if (options.maxDomainSegments) {
        if (segments.length > options.maxDomainSegments) {
            return errorCode('DOMAIN_SEGMENTS_COUNT_MAX');
        }
    }

    const tlds = options.tlds;
    if (tlds) {
        const tld = segments[segments.length - 1].toLowerCase();
        if (isTldsAllow(tlds)) {
            if (!tlds.allow.has(tld)) {
                return errorCode('DOMAIN_FORBIDDEN_TLDS');
            }
        } else if (tlds.deny.has(tld)) {
            return errorCode('DOMAIN_FORBIDDEN_TLDS');
        }
    }

    for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];

        if (!segment.length) {
            return errorCode('DOMAIN_EMPTY_SEGMENT');
        }

        if (segment.length > 63) {
            return errorCode('DOMAIN_LONG_SEGMENT');
        }

        if (i < segments.length - 1) {
            if (options.allowUnderscore) {
                const segmentRx = options.allowForwardSlash
                    ? DOMAIN_UNDERSCORE_FORWARD_SLASH_SEGMENT_RX
                    : DOMAIN_UNDERSCORE_SEGMENT_RX;
                if (!segmentRx.test(segment)) {
                    return errorCode('DOMAIN_INVALID_CHARS');
                }
            } else {
                const segmentRx = options.allowForwardSlash ? DOMAIN_FORWARD_SLASH_SEGMENT_RX : DOMAIN_SEGMENT_RX;
                if (!segmentRx.test(segment)) {
                    return errorCode('DOMAIN_INVALID_CHARS');
                }
            }
        } else {
            if (!TLD_SEGMENT_RX.test(segment)) {
                return errorCode('DOMAIN_INVALID_TLDS_CHARS');
            }
        }
    }

    return null;
}

/**
 * Analyzes a string to verify it is a valid domain name.
 *
 * @param domain - the domain name to validate.
 * @param options - optional settings.
 *
 * @return - true when valid, otherwise false.
 */
export function isDomainValid(domain: string, options?: DomainOptions) {
    return !analyzeDomain(domain, options);
}

function punycode(domain: string, allowForwardSlash?: boolean) {
    if (allowForwardSlash) {
        return domain
            .split('.')
            .map((segment) =>
                segment
                    .split('/')
                    .map((part) => punycodePart(part))
                    .join('/')
            )
            .join('.');
    }

    return punycodePart(domain);
}

function punycodePart(part: string) {
    if (part.includes('%')) {
        part = part.replace(/%/g, '%25');
    }

    try {
        return new URL_IMPL(`http://${part}`).host;
    } catch (err) {
        return part;
    }
}

export function validateDomainOptions(options: DomainOptions) {
    if (!options) {
        return;
    }

    if (typeof options.tlds !== 'object') {
        throw new Error('Invalid options: tlds must be a boolean or an object');
    }

    if (isTldsAllow(options.tlds)) {
        if (options.tlds.allow instanceof Set === false) {
            throw new Error('Invalid options: tlds.allow must be a Set object or true');
        }

        if ((options.tlds as any).deny) {
            throw new Error('Invalid options: cannot specify both tlds.allow and tlds.deny lists');
        }
    } else {
        if (options.tlds.deny instanceof Set === false) {
            throw new Error('Invalid options: tlds.deny must be a Set object');
        }
    }
}
