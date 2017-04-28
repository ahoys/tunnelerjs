/**
 * Verifies that the authentication files are set properly.
 * 1) auth.json exists, 2) token given, 3) id given, 4) owner given.
 */
const fs = require('fs');
module.exports = (Debug) => {
    if (!fs.existsSync('./config/auth.json')) {
        Debug.print('config/auth.json is missing. The process will now exit.', 'AUTH ERROR');
        process.exit(1);
    }
    const Auth = require('../config/auth.json');
    if (typeof Auth.token !== 'string') {
        Debug.print('Invalid token given.', 'AUTH ERROR');
        process.exit(1);
    }
    const reg = new RegExp(/^\d+$/);
    if (typeof Auth.id !== 'string' || !reg.test(Auth.id)) {
        Debug.print('Invalid id given.', 'AUTH ERROR');
        process.exit(1);
    }
    if (typeof Auth.owner !== 'string' || !reg.test(Auth.owner)) {
        Debug.print('Invalid owner given.', 'AUTH ERROR');
        process.exit(1);
    }
    Debug.print('Authentication file auth.json loaded.', 'AUTH SUCCESS');
    return Auth;
};
