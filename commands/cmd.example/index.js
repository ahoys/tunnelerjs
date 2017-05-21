const {print, log} = require('../../util/module.inc.debug')();

/**
 * This file is intented to be an example template for
 * custom commands.
 *
 * Copy & paste the command folder and modify it to fit
 * your needs.
 *
 * "Settings" : Settings given to the command (command.json).
 * You can set custom configurations in command.json.
 *
 * "Strings" : Localized strings given to the command (command.json).
 * The language is selected automatically based on the settings.
 *
 * "name" : The main key-word of the command. eg. "example" if cmd.example.
 * Note that the used key word may differ.
 *
 * Author: Your Name
 * Date: Jan 1. 1970
 *
 * @param {object} Settings
 * @param {object} Strings
 * @param {string} name
 * @return {object}
 */
module.exports = (Settings, Strings, name) => {
    const module = {};

    /**
     * Returns an example string.
     *
     * Methods like these are not mandatory, you can also
     * only use the module.execute if it suits the command better.
     * @param {string} msg : A simple message string.
     * @return {number}
     */
    const getString = (msg) => {
        log(`I'm going to log this. `
        + `Log won't be displayed in the console. Only log.`, name);
        return `${msg} example.`;
    };

    /**
     * Executes the command.
     *
     * This public handle function is mandatory. The system will
     * access this command from here. Commands without module.execute won't
     * be registered.
     * @param {object} Message : Discord.js Message object.
     * @return {string} : The string that will be used as a reply.
     */
    module.execute = (Message) => {
        try {
            const string = getString('just an');
            return `${Strings['success_0']}${string}${Strings['success_1']}`;
        } catch (e) {
            print(`Command execution failed.`, name, true, e);
        }
        return '';
    };

    return module;
};
