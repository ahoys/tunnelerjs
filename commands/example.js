/**
 * This file is intented to be an example template for
 * custom commands.
 */
module.exports = (Debug, Strings, Client) => {
    const module = {};

    // Command strings
    // Append config/strings.json with your own strings.
    // Your strings should be inside commands.COMMAND_NAME_HERE.
    // Always provide at least a "default" language. It is used whenever the given language
    // is not available.
    const stringsJSON = Strings.get(['commands', 'COMMAND_NAME_HERE']);

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
            // Use Debug.print to inform the user about the problem.
            // This will deploy a new console message and a log entry.
            // Avoid sharing passwords or other crucial information here.
            Debug.print('Executing COMMAND_NAME_HERE failed.', 'COMMAND_NAME_HERE ERROR', true, e);
            // Return false when the execution has failed.
            return false;
        }
    };

    return module;
}
