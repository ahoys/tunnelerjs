const Auth = require('./auth.json');
const CommandsStr = require('./commands.json');
module.exports = () => {

    const module = {};

    /**
     * A simple message handler.
     * Reads whether the bot is mentioned and based on that returns the inputted command for further processing.
     * @param Message
     * @returns {*}
     */
    module.handleMessage = (Message) => {
        if (
            Message !== undefined &&
            Message.isMentioned(Auth.id) &&
            Message.content !== undefined &&
            Message.content.length < 256
        ) {
            let content = Message.content.replace(/\s+/g, ' ').replace(`<@${Auth.id}> `, '').toLowerCase().trim();
            // We'll only allow some very specific characters because of security reasons.
            if (/^[a-zA-Z0-9.,!?\-= ]+$/.test(content)) {
                // The command will not be processed if it cannot be found from the command mapping (commands.json).
                content = content.split(' ', 2);
                if (CommandsStr['command_mapping'].hasOwnProperty(content[0])) {
                    // We'll wrap the command this way because we might want to use multiple different command words
                    // for the same functions.
                    return {
                        cmd: CommandsStr['command_mapping'][content[0]],
                        str: content[1]
                    };
                }
            }
            return {
                cmd: CommandsStr['command_mapping']['default'],
                str: undefined
            }
        }
        return {};
    };

    return module;
};