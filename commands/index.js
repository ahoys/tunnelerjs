const {print, log} = require('../util/module.inc.debug')();
const fs = require('fs');

/**
 * Automatic command loader.
 * The loader will map command execution file path and strings
 * into key object pairs.
 *
 * Author: Ari Höysniemi
 * Date: May 5. 2017
 * @return {object}
 */
module.exports = () => {
    const module = {};
    const cmdMap = {};
    const mwMap = {};

    /**
     * Loads a middleware from the given directory.
     * @param {string} dir
     * @param {string} type
     * @return {object}
     */
    const loadModule = (dir, type) => {
        // Load file paths.
        // jsPath is the actual functioning code with module.execute.
        // json contains all the required strings, settings and validation.
        const jsPath = `./commands/${dir}/index.js`;
        const jsonPath = `./commands/${dir}/${type}.json`;
        // Make sure the required javascript core file exists.
        if (!fs.existsSync(jsPath)) {
            print(`File (${jsPath}) missing.`, 'commands');
            return {};
        };
        // Make sure the execution handle exists by attempting to
        // load it.
        try {
            if (typeof require(`.${jsPath}`)().execute !== 'function') {
                print(`Execute handle for ${jsPath} missing.`, 'commands');
                return {};
            }
        } catch (e) {
            print(`File (${jsPath}) contains problems and will not be loaded.`,
                'commands', true, e);
            return {};
        }
        // Load the json file. If not available, use empty object.
        const moduleJSON = fs.existsSync(jsonPath)
            ? require(`.${jsonPath}`) : {};
        // Read the json and return the results.
        const { settings, strings, validate } = moduleJSON;
        return {
            jsPath,
            settings: typeof settings === 'object' ? settings : {},
            strings: typeof strings === 'object' ? strings : {},
            validate: typeof validate === 'object' ? validate : {},
        }
    };

    /**
     * Loads all the available commands into a
     * command frames that can be later used to execute
     * commands.
     * @return {object}
     */
    module.initialize = () => {
        try {
            const folders = fs.readdirSync('./commands');
            folders.forEach((dir) => {
                const nameSplit = dir.split('.');
                if (nameSplit.length === 2) {
                    if (nameSplit[0] === 'cmd') {
                        // Command module.
                        const thisModule = loadModule(dir, 'command');
                        if (thisModule.jsPath) {
                            cmdMap[nameSplit[1]] = thisModule;
                        }
                        log(`Command (${nameSplit[1]}) loaded.`,
                            `commands`);
                    } else if (nameSplit[0] === 'mw') {
                        // Middleware module.
                        const thisModule = loadModule(dir, 'middleware');
                        if (thisModule.jsPath) {
                            mwMap[nameSplit[1]] = thisModule;
                        }
                        log(`Middleware (${nameSplit[1]}) loaded.`,
                            `commands`);
                    }
                }
            });
            print(
                `${Object.keys(cmdMap).length} commands loaded.`,
                    'commands', false);
            print(
                `${Object.keys(mwMap).length} middlewares loaded.`,
                    'commands', false);
            return {cmdMap, mwMap};
        } catch (e) {
            print('Indexing commands failed. The process will now exit.',
                'commands', true, e);
            process.exit(1);
        }
        return {};
    };

    return module;
};
