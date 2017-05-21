const {print} = require('../util/module.inc.debug')();

/**
 * Creates and returns and authentication object.
 * Will prevent further execution if crucial files are missing.
 *
 * Author: Ari Höysniemi
 * Date: May 6. 2017
 */
const fs = require('fs');
module.exports = () => {
    const module = {};
    const auth = {};

    module.initialize = () => {
        try {
            const folderItems = fs.readdirSync('./auth');
            if (!folderItems.includes('auth.json')) {
                // auth.json not found.
                print('auth/auth.json file has not been set. '
                + 'The process will now exit.', 'AUTH CRITICAL');
                process.exit(1);
            }
            const authJSON = require('../auth/auth.json');
            if (typeof authJSON !== 'object') {
                // auth.json invalid type.
                print(`auth/auth.json has invalid type `
                + `(${typeof authJSON}). Should be object. `
                + `The process will now exit.`, 'AUTH CRITICAL');
                process.exit(1);
            }
            auth.id = authJSON.id;
            const regId = new RegExp(/^[a-zA-Z0-9]{1,18}$/);
            if (typeof auth.id !== 'string' || !regId.test(auth.id)) {
                print(`Invalid id (${auth.id}). `
                + `The process will now exit.`, 'AUTH CRITICAL');
                process.exit(1);
            }
            print(`Id ${auth.id} registered.`, 'AUTH', false);
            auth.token = authJSON.token;
            if (typeof auth.token !== 'string' || auth.token.length < 8) {
                print(`Invalid token (${auth.token}). `
                + `The process will now exit.`, 'AUTH CRITICAL');
                process.exit(1);
            }
            print(`Token ${auth.token.substr(1, 6)}... registered.`,
            'AUTH', false);
            auth.owner = authJSON.owner;
            if (typeof auth.owner !== 'string' || !regId.test(auth.owner)) {
                print(`Invalid owner (${auth.owner}). `
                + `The process will now exit.`, 'AUTH CRITICAL');
                process.exit(1);
            }
            print(`Owner ${auth.owner} registered.`, 'AUTH', false);
            print('Authentication successfully configured.', 'AUTH',
            false);
            return auth;
        } catch (e) {
            print('Authentication failed. The process will now exit.',
            'AUTH CRITICAL', true, e);
            process.exit(1);
            return {};
        }
    };

    return module;
};
