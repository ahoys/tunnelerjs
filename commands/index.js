const {print, log} = require('../util/module.inc.debug')();
const fs = require('fs');

/**
 * Automatic command & middleware module frame loader.
 * The loader will map the required filepaths and resources
 * into a one frame.
 * 
 * These frames are used and tailored by the guild loader.
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
    // Setting filenames for the types.
    const typePaths = {
        cmd: 'command.json',
        mw: 'middleware.json',
    }

    /**
     * Loads a module from the given directory.
     * @param {string} dir directory path
     * @param {string} type module type, eg. cmd or mw.
     * @param {string} name name of the module, eg. ping
     * @return {object} a validated module frame.
     */
    const loadModuleFrame = (dir, type, name) => {
        try {
            // Paths to the essential files.
            const jsPath = `./commands/${dir}/index.js`;
            const jsonPath = `./commands/${dir}/${typePaths[type]}`;
            // A valid JavaScript execution file must exist.
            if (!fs.existsSync(jsPath)) {
                print(`Missing (${jsPath}), (${name}) cannot be loaded.`,
                    'commands');
                return {};
            }
            // Execution function must exist.
            if (typeof require(`.${jsPath}`)().execute !== 'function') {
                print(`Module.execute for (${name}) is invalid or missing.`,
                    'commands');
                return {};
            }
            const returnPayload = {jsPath};
            // Handle json settings if available.
            if (fs.existsSync(jsonPath)) {
                const moduleJSON = require(`.${jsonPath}`);
                if (typeof moduleJSON.moduleSettings === 'object') {
                    // Custom module settings found.
                    // Module settings are global and affect all guilds.
                    returnPayload.moduleSettings = moduleJSON.moduleSettings;
                }
                if (
                    typeof moduleJSON.strings === 'object' &&
                    typeof moduleJSON.strings.default === 'object'
                ) {
                    // Custom strings found.
                    // Default strings must always be present.
                    returnPayload.strings = moduleJSON.strings;
                }
                if (typeof moduleJSON.guildSettings === 'object') {
                    // Custom guild settings found.
                    // Guild settings are guild specific.
                    returnPayload.guildSettings = moduleJSON.guildSettings;
                }
            }
            return returnPayload;
        } catch (e) {
            print(`Failed to load a module (${name}). `
                + `See the log for more info`,
                'commands', true, e);
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
                    const thisModuleFrame = loadModuleFrame(item, type, name);
                    // Loading will return an empty object
                    // if the load failed. Therefore make sure
                    // the object has at least the js included.
                    if (thisModuleFrame.jsPath) {
                        if (type === 'cmd') {
                            // Save a command.
                            cmdMap[name] = thisModuleFrame;
                        } else if (type === 'mw') {
                            // Save a middleware.
                            mwMap[name] = thisModuleFrame;
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
