/**
 * Implements commands functionality.
 */
const fs = require('fs');
module.exports = (Debug, Auth) => {
    const module = {};

    // Init
    const commandsSrc = {};
    const filepath = './commands/';
    let commandsJSON = {};
    try {
        // Load the commands.
        const files = fs.readdirSync(filepath);
        files.forEach((file) => {
            const parts = file.split('.');
            if (
                parts &&
                parts.length === 4 &&
                parts[0] === 'cmd' &&
                parts[1] === 'inc' &&
                parts[3] === 'js'
            ) {
                // Pair a key and a command module.
                commandsSrc[parts[2]] = require(`.${filepath}${file}`);
            }
        });
        // Make sure the call keys exist.
        if (Object.keys(commandsSrc).length > 0 && !fs.existsSync('./config/commands.json')) {
            Debug.print('config/commands.json is missing. The process will now exit.', 'COMMANDS ERROR');
            process.exit(1);
        }
        // Inform the user if there are no commands available for some reason.
        if (Object.keys(commandsSrc).length < 1) {
            Debug.print(`There are no commands available in ${filepath}`, 'COMMANDS');
        }
        commandsJSON = require('../config/commands.json');
    } catch (e) {
        Debug.print('Reading command files failed. The process will now exit.', 'COMMANDS ERROR');
        process.exit(1);
    }

    /**
     * Returns all keys that match a command.
     */
    module.getKeys = () => {
        try {
            return Object.keys(commandsSrc) || [];
        } catch (e) {
            Debug.print('Returning commands failed.', 'COMMANDS ERROR');
            return [];
        }
    }

    /**
     * Returns a specific command based on a key.
     */
    module.get = (key = '') => {
        try {
            if (typeof key === 'string') {
                return commandsSrc[key] || (() => {});
            }
            return (() => {});
        } catch (e) {
            Debug.print(`Returning a command (${key}) failed.`, 'COMMANDS ERROR');
            return (() => {});
        }
    }

    /**
     * Returns true if the given id has access to a command.
     */
    module.hasAccess = (key = '', id = '0') => {
        try {
            if (typeof key === 'string' && typeof id === 'string') {
                if (commandsSrc[key] === undefined) {
                    // No such command.
                    Debug.print(`Trying to get an access to an unknown command (${key}).`, 'COMMANDS ERROR');
                    return false;
                }
                if (id === Auth.owner) {
                    // A full access granted for the owner.
                    // No matter whether the access exists.
                    return true;
                }
                const thisAccess = commandsJSON.commands_access[key];
                if (thisAccess === undefined) {
                    // The access is missing.
                    Debug.log(`Access (${key}) does not exist.`);
                    return false;
                }
                if (thisAccess.indexOf('all') > -1) {
                    // Everyone can access.
                    return true;
                }
                return thisAccess.indexOf(id) > -1;
            }
            return false;
        } catch (e) {
            Debug.print(`Returning access to (${key}) failed.`, 'COMMANDS ERROR');
            return false;
        }
    }

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