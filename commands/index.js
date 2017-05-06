/**
 * Automatic command loader.
 * The loader will map command execution file path and strings into key object pairs.
 * 
 * Author: Ari Höysniemi
 * Date: May 5. 2017
 */
const fs = require('fs');
const _ = require('lodash');
module.exports = (Debug) => {
    const module = {};
    const commands = {};

    /**
     * Loads all the available commands into a
     * command frames that can be later used to execute
     * commands.
     * @returns {object} : a map of commands.
     */
    module.initialize = () => {
        try {
            const folders = fs.readdirSync('./commands');
            folders.forEach((folder) => {
                const nameSplit = folder.split('.');
                // The folder must be named as: "cmd.key", eg. "cmd.ping".
                if (nameSplit[0] === 'cmd' && nameSplit.length === 2) {
                    const jsPath = `./commands/${folder}/index.js`;
                    const settingsPath = `./commands/${folder}/command.json`;
                    if (fs.existsSync(jsPath) && fs.existsSync(settingsPath)) {
                        // Validate execution.
                        const commandJSON = require(`.${settingsPath}`);
                        const execute = require(`.${jsPath}`)().execute;
                        if (_.isFunction(execute)) {
                            // Validate settings & strings.
                            const commandJSON = require(`.${settingsPath}`);
                            if (
                                typeof commandJSON === 'object' &&
                                typeof commandJSON["settings"] === "object" &&
                                typeof commandJSON["localizations"] === 'object'
                            ) {
                                // Construct a command frame. Note that we'll only provide a textual path to
                                // the file as the language will be decided later on.
                                commands[nameSplit[1]] = {
                                    jsPath,
                                    settings: commandJSON["settings"],
                                    strings: commandJSON["localizations"],
                                };
                            } else {
                                Debug.log(`Command (${folder}) is missing a valid (${settingsPath}) file. Skipping...`, 'COMMANDS WARN');
                            }
                        } else {
                            Debug.log(`Command (${folder}) did not have a valid execution handle in (${jsPath}). Skipping...`, 'COMMANDS WARN');
                        }
                    } else {
                        Debug.log(`Command (${folder}) is missing crucial files. Skipping...`, 'COMMANDS WARN');
                    }
                }
            });
            Debug.print(`Commands [${Object.keys(commands)}] registered.`, 'COMMANDS', false);
            Debug.print('Commands successfully configured.', 'COMMANDS', false);
            return commands;
        } catch (e) {
            Debug.print('Indexing commands failed. The process will now exit.', 'COMMANDS CRITICAL', true, e);
            process.exit(1);
        }
    }

    return module;
}
