/**
 * Verifies that the authentication files are set properly.
 * 1) auth.json exists, 2) token given, 3) id given, 4) owner given.
 */
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
    const reg = new RegExp(/^\d+$/);
    if (typeof Auth.id !== 'string' || !reg.test(Auth.id)) {
        console.log('[AUTH ERROR] Invalid id given.');
        process.exit(1);
    }
    if (typeof Auth.owner !== 'string' || !reg.test(Auth.owner)) {
        console.log('[AUTH ERROR] Invalid owner given.');
        process.exit(1);
    }
    console.log('[AUTH SUCCESS] Authentication file validation.');
    return Auth;
};
