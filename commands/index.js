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
     * Loads a command from the given directory.
     * @param {string} dir
     * @return {object}
     */
    const loadCommand = (dir) => {
        // Load file paths.
        const jsPath = `./commands/${dir}/index.js`;
        const jsonPath = `./commands/${dir}/command.json`;
        // Validate files.
        if (!fs.existsSync(jsPath) || !fs.existsSync(jsonPath)) return {};
        if (typeof require(`.${jsPath}`)().execute !== 'function') return {};
        // Validate the command.json settings file.
        const commandJSON = require(`.${jsonPath}`);
        if (
            typeof commandJSON !== 'object' ||
            typeof commandJSON.settings !== 'object' ||
            typeof commandJSON.localizations !== 'object'
        ) return {};
        // Return a command frame.
        return {
            jsPath,
            settings: commandJSON.settings,
            strings: commandJSON.localizations,
        };
    };

    /**
     * Loads a middleware from the given directory.
     * @param {string} dir
     * @return {object}
     */
    const loadMiddleware = (dir) => {
        // Load file paths.
        const jsPath = `./commands/${dir}/index.js`;
        const jsonPath = `./commands/${dir}/middleware.json`;
        // Validate files.
        if (!fs.existsSync(jsPath) || !fs.existsSync(jsonPath)) return {};
        if (typeof require(`.${jsPath}`)().execute !== 'function') return {};
        // Validate the command.json settings file.
        const middlewareJSON = require(`.${jsonPath}`);
        if (
            typeof middlewareJSON !== 'object' ||
            typeof middlewareJSON.localizations !== 'object'
        ) return {};
        // Return a middleware frame.
        return {
            jsPath,
            settings: middlewareJSON.settings,
            strings: middlewareJSON.localizations
        };
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
                if (nameSplit[0] === 'cmd' && nameSplit.length === 2) {
                    // Command folder.
                    const thisCmd = loadCommand(dir);
                    if (thisCmd.jsPath) {
                        cmdMap[nameSplit[1]] = thisCmd;
                        log(`Command (${nameSplit[1]}) loaded.`,
                        `COMMANDS`);
                    }
                } else if (nameSplit[0] === 'mw' && nameSplit.length === 2) {
                    // Middleware folder.
                    const thisMid = loadMiddleware(dir);
                    if (thisMid.jsPath) {
                        mwMap[nameSplit[1]] = thisMid;
                        log(`Middleware (${nameSplit[1]}) loaded.`,
                        `COMMANDS`);
                    }
                }
            });
            print(
                `${Object.keys(cmdMap).length} commands loaded.`,
                'COMMANDS', false);
            print(
                `${Object.keys(mwMap).length} middlewares loaded.`,
                'COMMANDS', false);
            return {cmdMap, mwMap};
        } catch (e) {
            print('Indexing commands failed. The process will now exit.',
            'COMMANDS CRITICAL', true, e);
            process.exit(1);
            return {};
        }
    };

    return module;
};
