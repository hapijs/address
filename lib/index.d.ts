export namespace domain {

    /**
     * Analyzes a string to verify it is a valid domain name.
     * 
     * @param domain - the domain name to validate.
     * @param options - optional settings.
     * 
     * @return - undefined when valid, otherwise an object with single error key with a string message value.
     */
    function analyze(domain: string, options?: Options): Analysis | null;

    /**
     * Analyzes a string to verify it is a valid domain name.
     * 
     * @param domain - the domain name to validate.
     * @param options - optional settings.
     * 
     * @return - true when valid, otherwise false.
     */
    function isValid(domain: string, options?: Options): boolean;

    interface Options {

        /**
         * Determines whether Unicode characters are allowed.
         * 
         * @default true
         */
        readonly allowUnicode?: boolean;

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
        readonly tlds?: Tlds.Allow | Tlds.Deny | boolean;
    }

    namespace Tlds {

        interface Allow {
            readonly allow: Set<string> | true;
        }

        interface Deny {
            readonly deny: Set<string>;
        }
    }
}


export namespace email {

    /**
     * Analyzes a string to verify it is a valid email address.
     * 
     * @param email - the email address to validate.
     * @param options - optional settings.
     * 
     * @return - undefined when valid, otherwise an object with single error key with a string message value.
     */
    function analyze(email: string, options?: Options): Analysis | null;

    /**
     * Analyzes a string to verify it is a valid email address.
     * 
     * @param email - the email address to validate.
     * @param options - optional settings.
     * 
     * @return - true when valid, otherwise false.
     */
    function isValid(email: string, options?: Options): boolean;

    interface Options extends domain.Options {

        /**
         * Determines whether to ignore the standards maximum email length limit.
         * 
         * @default false
         */
        readonly ignoreLength?: boolean;
    }
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


export const errors: Record<string, string>;
