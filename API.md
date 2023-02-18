## Methods

### `analyzeDomain(domain, [options])`

Analyzes a string to verify it is a valid domain name where:

-   `domain` - the domain name string being verified.
-   `options` - optional settings:
    -   `allowUnicode` - if `false`, Unicode characters are not allowed in domain names. Defaults to `true`.
    -   `allowUnderscore` - if `false`, underscore (`_`) characters will not be allowed in the domain name. Defaults to `false`.
    -   `minDomainSegments` - the minimum number of domain segments (e.g. `x.y.z` has 3 segments) required. Defaults to `2`.
    -   `tlds` - options to validate the top-level-domain segment (e.g. `com` in `example.com`) where:
        -   `deny` - a `Set` with strings matching forbidden TLD values (all non-matching values are allowed).
        -   `allow` - a `Set` with strings matching the only allowed TLD values.

If the `domain` is valid, no return value. If the `domain` is invalid, an object is returned with:

-   `error` - a string containing the reason the domain is invalid.

### `isDomainValid(domain, [options])`

Validates a string to verify it is a valid domain name where:

-   `domain` - the domain name string being verified.
-   `options` - same options as [`analyzeDomain()`](#analyzedomaindomain-options).

### `analyzeEmail(email, [options])`

Analyzes a string to verify it is a valid email address where:

-   `email` - the email address string being verified.
-   `options` - optional settings:
    -   `allowUnicode` - if `false`, Unicode characters are not allowed in the email address local and domain parts. Defaults to `true`.
    -   `allowUnderscore` - if `false`, underscore (`_`) characters will not be allowed in the domain name. Defaults to `false`.
    -   `ignoreLength` - if `true`, the standards email maximum length limit is ignored. Defaults to `true`.
    -   `minDomainSegments` - the minimum number of domain segments (e.g. `x.y.z` has 3 segments) required in the domain part. Defaults to `2`.
    -   `tlds` - options to validate the top-level-domain segment (e.g. `com` in `example.com`) where:
        -   `deny` - a `Set` with strings matching forbidden TLD values (all non-matching values are allowed).
        -   `allow` - a `Set` with strings matching the only allowed TLD values.

If the `email` is valid, no return value. If the `email` is invalid, an object is returned with:

-   `error` - a string containing the reason the email is invalid.

### `isEmailValid(email, [options])`

Validates a string to verify it is a valid email address where:

-   `email` - the email address string being verified.
-   `options` - same options as [`analyzeEmail()`](#analyzeemailemail-options).

### `errorCodes`

An object containing a key per error code with a matching string value description.
