const CommandsStr = require('../config/commands.json');
module.exports = () => {

    const module = {};

    /**
     * Returns a command container.
     * Container holds the command key and a parameter value for the command.
     * @param messageObject: Discord.js Message object.
     * @param mId: mentioned person that triggers the command.
     * @returns {*}
     */
    module.getContainer = (messageObject, mId) => {
        if (
            messageObject !== undefined &&
            messageObject.isMentioned(mId) &&
            messageObject.content !== undefined &&
            messageObject.content.length < 128
        ) {
            // Remove mention id and reformat the command by removing anything unnecessary.
            let content = messageObject.content.replace(/\s+/g, ' ').replace(`<@${mId}> `, '').toLowerCase().trim();
            // We'll only allow some very specific characters because of security reasons.
            if (/^[a-zA-Z0-9.?:!;"`',\-=@ ]+$/.test(content)) {
                // The command will not be processed if it cannot be found from the command mapping (commands.json).
                // First part is the command, second is the parameter.
                content = content.split(' ', 16);
                if (CommandsStr['command_mapping'].hasOwnProperty(content[0])) {
                    // We'll wrap the command this way because we might want to use multiple different command words
                    // for the same action.
                    return {
                        cmd: CommandsStr['command_mapping'][content[0]],
                        str: content
                    };
                }
            }
            // The given command was not found. Enable random chattering.
            return {
                cmd: CommandsStr['command_mapping']['default'],
                str: undefined
            }
        }
        return {};
    };

    return module;
};