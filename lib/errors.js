'use strict';

exports.errorsByCode = {
    BE_NON_EMPTY_STRING: 'Address must be a non-empty string',
    FORBIDDEN_UNICODE: 'Address contains forbidden Unicode characters',
    AT_CHAR_NEG: 'Address cannot contain more than one @ character',
    AT_CHAR_ONE: 'Address must contain one @ character',
    LOCAL_NOT_EMPTY: 'Address local part cannot be empty',
    ADDRESS_TOO_LONG: 'Address too long',
    LOCAL_TOO_LONG: 'Address local part too long',
    LOCAL_NOT_EMPTY_DOT: 'Address local part contains empty dot-separated segment',
    LOCAL_INVALID_CHARS: 'Address local part contains invalid character',
    DOMAIN_BE_STRING: 'Invalid input: domain must be a string',
    DOMAIN_NON_EMPTY_STRING: 'Domain must be a non-empty string',
    DOMAIN_TOO_LONG: 'Domain too long',
    DOMAIN_INVALID_UNICODE_CHARS: 'Domain contains forbidden Unicode characters',
    DOMAIN_INVALID_CHARS: 'Domain contains invalid character',
    DOMAIN_INVALID_TLDS_CHARS: 'Domain contains invalid tld character',
    DOMAIN_SEGMENT: 'Domain lacks the minimum required number of segments',
    DOMAIN_FORBIDDEN_TLDS: 'Domain uses forbidden TLD',
    DOMAIN_EMPTY_SEGMENT: 'Domain contains empty dot-separated segment',
    DOMAIN_DOTS_SEGMENT: 'Domain contains dot-separated segment that is too long'
};
