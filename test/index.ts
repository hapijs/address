import * as Address from '..';
import * as Lab from '@hapi/lab';


const { expect } = Lab.types;


// domain.analyze()

Address.domain.analyze('example.com');
Address.domain.analyze('example.com', { minDomainSegments: 3, allowUnicode: false });
Address.domain.analyze('example.com', { tlds: false });
Address.domain.analyze('example.com', { tlds: true });
Address.domain.analyze('example.com', { tlds: { allow: new Set<string>('x') } });
Address.domain.analyze('example.com', { tlds: { allow: new Set('x') } });
Address.domain.analyze('example.com', { tlds: { allow: true } });
Address.domain.analyze('example.com', { tlds: { deny: new Set<string>('x') } });
Address.domain.analyze('example.com', { tlds: { deny: new Set('x') } });

expect.type<Address.Analysis | null>(Address.domain.analyze('example.com'));

expect.error(Address.domain.analyze());
expect.error(Address.domain.analyze(123));
expect.error(Address.domain.analyze('test', 123));
expect.error(Address.domain.analyze('example.com', { unknown: true }));
expect.error(Address.domain.analyze('example.com', { tlds: 1 }));
expect.error(Address.domain.analyze('example.com', { tlds: {} }));
expect.error(Address.domain.analyze('example.com', { tlds: { allow: 1 } }));
expect.error(Address.domain.analyze('example.com', { tlds: { allow: 'com' } }));
expect.error(Address.domain.analyze('example.com', { tlds: { allow: new Set<number>() } }));
expect.error(Address.domain.analyze('example.com', { tlds: { deny: 'com' } }));
expect.error(Address.domain.analyze('example.com', { tlds: { deny: new Set<number>() } }));


// domain.isValid()

Address.domain.isValid('example.com');
Address.domain.isValid('example.com', { minDomainSegments: 3, allowUnicode: false });
Address.domain.isValid('example.com', { tlds: false });
Address.domain.isValid('example.com', { tlds: true });
Address.domain.isValid('example.com', { tlds: { allow: new Set<string>('x') } });
Address.domain.isValid('example.com', { tlds: { allow: new Set('x') } });
Address.domain.isValid('example.com', { tlds: { allow: true } });
Address.domain.isValid('example.com', { tlds: { deny: new Set<string>('x') } });
Address.domain.isValid('example.com', { tlds: { deny: new Set('x') } });

expect.type<boolean>(Address.domain.isValid('example.com'));

expect.error(Address.domain.isValid());
expect.error(Address.domain.isValid(123));
expect.error(Address.domain.isValid('test', 123));
expect.error(Address.domain.isValid('example.com', { unknown: true }));
expect.error(Address.domain.isValid('example.com', { tlds: 1 }));
expect.error(Address.domain.isValid('example.com', { tlds: {} }));
expect.error(Address.domain.isValid('example.com', { tlds: { allow: 1 } }));
expect.error(Address.domain.isValid('example.com', { tlds: { allow: 'com' } }));
expect.error(Address.domain.isValid('example.com', { tlds: { allow: new Set<number>() } }));
expect.error(Address.domain.isValid('example.com', { tlds: { deny: 'com' } }));
expect.error(Address.domain.isValid('example.com', { tlds: { deny: new Set<number>() } }));


// email.analyze()

Address.email.analyze('example.com');
Address.email.analyze('example.com', { minDomainSegments: 3, allowUnicode: false, ignoreLength: true });
Address.email.analyze('example.com', { tlds: false });
Address.email.analyze('example.com', { tlds: true });
Address.email.analyze('example.com', { tlds: { allow: new Set<string>('x') } });
Address.email.analyze('example.com', { tlds: { allow: new Set('x') } });
Address.email.analyze('example.com', { tlds: { allow: true } });
Address.email.analyze('example.com', { tlds: { deny: new Set<string>('x') } });
Address.email.analyze('example.com', { tlds: { deny: new Set('x') } });

expect.type<Address.Analysis | null>(Address.email.analyze('example.com'));

expect.error(Address.email.analyze());
expect.error(Address.email.analyze(123));
expect.error(Address.email.analyze('test', 123));
expect.error(Address.email.analyze('example.com', { unknown: true }));
expect.error(Address.email.analyze('example.com', { tlds: 1 }));
expect.error(Address.email.analyze('example.com', { tlds: {} }));
expect.error(Address.email.analyze('example.com', { tlds: { allow: 1 } }));
expect.error(Address.email.analyze('example.com', { tlds: { allow: 'com' } }));
expect.error(Address.email.analyze('example.com', { tlds: { allow: new Set<number>() } }));
expect.error(Address.email.analyze('example.com', { tlds: { deny: 'com' } }));
expect.error(Address.email.analyze('example.com', { tlds: { deny: new Set<number>() } }));


// email.isValid()

Address.email.isValid('test@example.com');
Address.email.isValid('test@example.com', { minDomainSegments: 3, allowUnicode: false, ignoreLength: true });
Address.email.isValid('test@example.com', { tlds: false });
Address.email.isValid('test@example.com', { tlds: true });
Address.email.isValid('test@example.com', { tlds: { allow: new Set<string>('x') } });
Address.email.isValid('test@example.com', { tlds: { allow: new Set('x') } });
Address.email.isValid('test@example.com', { tlds: { allow: true } });
Address.email.isValid('test@example.com', { tlds: { deny: new Set<string>('x') } });
Address.email.isValid('test@example.com', { tlds: { deny: new Set('x') } });

expect.type<boolean>(Address.email.isValid('test@example.com'));

expect.error(Address.email.isValid());
expect.error(Address.email.isValid(123));
expect.error(Address.email.isValid('test', 123));
expect.error(Address.email.isValid('test@example.com', { unknown: true }));
expect.error(Address.email.isValid('test@example.com', { tlds: 1 }));
expect.error(Address.email.isValid('test@example.com', { tlds: {} }));
expect.error(Address.email.isValid('test@example.com', { tlds: { allow: 1 } }));
expect.error(Address.email.isValid('test@example.com', { tlds: { allow: 'com' } }));
expect.error(Address.email.isValid('test@example.com', { tlds: { allow: new Set<number>() } }));
expect.error(Address.email.isValid('test@example.com', { tlds: { deny: 'com' } }));
expect.error(Address.email.isValid('test@example.com', { tlds: { deny: new Set<number>() } }));
