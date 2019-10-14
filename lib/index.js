'use strict';

const Domain = require('./domain');
const Email = require('./email');
const Tlds = require('./tlds');
const errorsByCode = require('./errors').errorsByCode;


const internals = {
    defaultTlds: { allow: Tlds, deny: null }
};

module.exports = {
    errors: {
        errorsByCode
    },

    domain: {
        analyze(domain, options) {

            options = internals.options(options);
            return Domain.analyze(domain, options);
        },

        isValid(domain, options) {

            options = internals.options(options);
            return Domain.isValid(domain, options);
        }
    },
    email: {
        analyze(email, options) {

            options = internals.options(options);
            return Email.analyze(email, options);
        },

        isValid(email, options) {

            options = internals.options(options);
            return Email.isValid(email, options);
        }
    }
};


internals.options = function (options) {

    if (!options) {
        return { tlds: internals.defaultTlds };
    }

    if (options.tlds === false) {                // Defaults to true
        return options;
    }

    if (!options.tlds ||
        options.tlds === true) {

        return Object.assign({}, options, { tlds: internals.defaultTlds });
    }

    if (typeof options.tlds !== 'object') {
        throw new Error(errorsByCode.TLDS_BOOL_OBJ);
    }

    if (options.tlds.deny) {
        if (options.tlds.deny instanceof Set === false) {
            throw new Error(errorsByCode.TLDS_DENY_SET);
        }

        if (options.tlds.allow) {
            throw new Error(errorsByCode.TLDS_ALLOW);
        }

        return options;
    }

    if (options.tlds.allow === true) {
        return Object.assign({}, options, { tlds: internals.defaultTlds });
    }

    if (options.tlds.allow instanceof Set === false) {
        throw new Error(errorsByCode.TLDS_ALLOW_SET);
    }

    return options;
};
