const fs = require('fs');
module.exports = () => {
    if (!fs.existsSync('./config/auth.json')) {
        console.log('[AUTH ERROR] config/auth.json is missing. The process will now exit.');
        process.exit(1);
    }
    const Auth = require('../config/auth.json');
    if (typeof Auth.token !== 'string') {
        console.log('[AUTH ERROR] Invalid token given.');
        process.exit(1);
    }
    if (typeof Auth.id !== 'string') {
        console.log('[AUTH ERROR] Invalid id given.');
        process.exit(1);
    }
    if (typeof Auth.owner !== 'string') {
        console.log('[AUTH ERROR] Invalid owner given.');
        process.exit(1);
    }
    console.log('[AUTH SUCCESS] Authentication file validation.');
    return Auth;
};
