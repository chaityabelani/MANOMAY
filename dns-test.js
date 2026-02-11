const dns = require('dns');

const hostname = '_mongodb._tcp.manomay.ninzcoz.mongodb.net';

console.log(`Resolving SRV for ${hostname}...`);

dns.resolveSrv(hostname, (err, addresses) => {
    if (err) {
        console.error('❌ DNS Lookup Failed:', err);
        console.error('Code:', err.code);
        console.error('Syscall:', err.syscall);
        console.error('Hostname:', err.hostname);
    } else {
        console.log('✅ DNS Lookup Succeeded!');
        console.log(addresses);
    }
});
