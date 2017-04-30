/**
 * This file is intented to be an example template for
 * custom commands.
 * 
 * Command: COMMAND_NAME_HERE (eg. ping if the file is called cmd.inc.ping.js)
 * Author: YOUR_NAME_HERE
 */
module.exports = (Debug, Strings, Client, Auth, cmd) => {
    const module = {};

    // Command strings
    // Append config/strings.json with your own strings.
    // Your strings should be inside commands.COMMAND_NAME_HERE.
    // Always provide at least a "default" language. It is used whenever the given language
    // is not available.
    const stringsJSON = Strings.get(['commands', cmd]);

    /**
     * Executes this command.
     * @returns {boolean}
     */
    module.execute = (payload) => {
        try {
            // "Message" holds the Discord.js Message object.
            // "string" holds a safe, parsed version of the Message.content string.
            // For security reasons, aim to use the "string" instead of the original message.
            const { Message, string } = payload;
            // Use the localized stringsJSON always when possible.
            // This way users can easily translate your strings.
            Message.reply(`${stringsJSON['success_0']}`);
            // Return true when the execution has passed successfully.
            return true;
        } catch (e) {
            // Inform about a problem.
            // This will deploy a new console message and a log entry.
            Debug.print(`Executing ${cmd} failed.`, `${cmd.toUpperCase()} ERROR`, true, e);
            return false;
        }
    };

    return module;
}
