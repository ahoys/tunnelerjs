/**
 * This file is intented to be an example template for
 * custom commands.
 * 
 * Copy & paste the command folder and modify it to fit
 * your needs.
 * 
 * @param Debug : Use Debug to print logged console messages.
 * Example 0: Debug.print("message that will also be logged.", "TAG")
 * Example 1: Debug.log("message that will only be logged.", "TAG")
 * Example 2: Debug.print("message that won't be logged.", "TAG", false)
 * Example 3: Debug.print("message with logged trace.", "TAG", true, error)
 * @param Settings : Settings given to the command (command.json).
 * You can set custom configurations in command.json.
 * @param Strings : Localized strings given to the command (command.json).
 * The language is selected automatically based on the settings.
 * @param name : The main key-word of the command. eg. "example" if cmd.example.
 * Note that the used key word may differ.
 * 
 * Author: Your Name
 * Date: Jan 1. 1970
 */
module.exports = (Debug, Settings, Strings, name) => {
    const module = {};

    /**
     * Returns an example string.
     * 
     * Methods like these are not mandatory, you can also
     * only use the module.execute if it suits the command better.
     * @returns {number}
     */
    const getString = (msg) => {
        return `${msg} example.`;
    };

    /**
     * Executes the command.
     * 
     * This public handle function is mandatory. The system will
     * access this command from here. Commands without module.execute won't
     * be registered.
     * @param {object} Message : Discord.js Message object.
     * @returns {string} : The string that will be used as a reply.
     */
    module.execute = (Message) => {
        try {
            const string = getString('just an');
            return `${Strings['success_0']}${string}${Strings['success_1']}`;
        } catch (e) {
            Debug.print(`Executing a command (${name}) failed.`, `${name} ERROR`, true, e);
            return '';
        }
    }

    return module;
}
