const {print} = require('./module.inc.debug')();
const fs = require('fs');

/**
 * Tools for files.
 * @return {object}
 */
module.exports = () => {
    const module = {};

    /**
     * Copies a file to a destination.
     * @param {string} source
     * @param {string} destination
     * @param {function} callback
     */
    module.copyFile = (source, destination, callback = (() => {})) => {
        try {
            let callbacked = false;
            done = (e) => {
                if (!callbacked) {
                    callback(e);
                    callbacked = true;
                }
            };
            const rd = fs.createReadStream(source);
            rd.on('error', (e) => {
                console.log('e', e);
                done(e);
            });
            const wr = fs.createWriteStream(destination);
            wr.on('error', (e) => {
                console.log('e1', e);
                done(e);
            });
            wr.on('close', () => {
                done();
            });
            rd.pipe(wr);
        } catch (e) {
            print('Copying files failed.',
            'FILES ERROR', true, e);
            callback(true);
        }
    };

    return module;
};
