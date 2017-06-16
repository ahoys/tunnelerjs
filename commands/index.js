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
    // cmdMap will include all the mapped commands.
    const cmdMap = {};
    // mwMap will include all the mapped middlewares.
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
        const { settings, strings, guildSettings } = moduleJSON;
        return {
            jsPath,
            settings: typeof settings === 'object' ? settings : {},
            strings: typeof strings === 'object' ? strings : {},
            guildSettings: typeof guildSettings === 'object'
                ? guildSettings : {},
        }
    };

    /**
     * Loads all the available modules into frames
     * that can be later used to execute the modules.
     * @return {object}
     */
    module.initialize = () => {
        try {
            fs.readdirSync('./commands').forEach((item) => {
                // The naming convention is following:
                // "type.name", eg. "cmd.ping".
                // The type can be either cmd or mw.
                const nameSplit = item.split('.');
                const type = nameSplit[0];
                const name = nameSplit[1];
                if (['cmd', 'mw'].indexOf(type) >= 0 && name !== undefined) {
                    // Load the module.
                    const thisModule = loadModule(item, type, name);
                    // Loading will return an empty object
                    // if the load failed. Therefore make sure
                    // the object has at least the js included.
                    if (thisModule.jsPath) {
                        if (type === 'cmd') {
                            // Save a command.
                            cmdMap[name] = thisModule;
                        } else if (type === 'mw') {
                            // Save a middleware.
                            mwMap[name] = thisModule;
                        }
                    }
                }
            });
            print(`${Object.keys(cmdMap).length} command(s) found.`,
                'commands', false);
            print(`${Object.keys(mwMap).length} middleware(s) found.`,
                'commands', false);
            return {cmdMap, mwMap};
        } catch (e) {
            print('Indexing commands failed. The process will now exit.',
                'commands', true, e);
            process.exit(1);
        }
    };

    return module;
};
