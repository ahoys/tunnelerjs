/**
 * Implements commands functionality.
 */
const fs = require('fs');
const _ = require('lodash');
const commandsJSON = require('../config/commands.json');
module.exports = (Debug, Auth, Settings, Strings, Client) => {
    const module = {};

    // Initialize templates.
    const cmdTemplates = {};
    const filepath = './commands/';
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
                // Pair a key to a command and save to templates.
                cmdTemplates[parts[2]] = require(`.${filepath}${file}`);
            }
        });
    } catch (e) {
        Debug.print('Reading command files failed. The process will now exit.', 'COMMANDS CRITICAL');
        process.exit(1);
    }

    /**
     * Returns true if the given id has access to a command.
     */
    module.hasAccess = (key, guildId, targetId) => {
        try {
            if (targetId === Auth.owner) {
                // Owner has a full access.
                return true;
            }
            const accessJSON = Settings.get(['guilds', guildId, 'commands_available', key, 'access']);
            return accessJSON.includes(targetId);
        } catch (e) {
            Debug.print(`Returning access to (${key}) failed.`, 'COMMANDS ERROR', true, e);
            return false;
        }
    }

    /**
     * Reads a command from a string.
     */
    module.readCommandKey = (str) => {
        try {
            let cmdKey = '';
            Object.keys(cmdTemplates).forEach((key) => {
                if (str.includes(key)) {
                    // A command key found.
                    cmdKey = key;
                }
            });
            return cmdKey;
        } catch (e) {
            Debug.print('Failed to read a command.', 'COMMANDS ERROR', true, e);
            return '';
        }
    }

    /**
     * Returns a guild specific package of tailored commands.
     */
    module.getGuildPackage = (id) => {
        try {
            const settingsJSON = Settings.get(['guilds', id]);
            if (typeof settingsJSON !== 'object') {
                // The guild is missing from the settings.
                Debug.print(`Missing settings for a guild (${id}). See config/settings.json.`);
                return {};
            }
            if (typeof settingsJSON['commands_available'] !== 'object') {
                // No commands available, no reason to continue.
                Debug.log(`Guild (${id}) had no commands set. See configs/settings.json.`, 'COMMANDS');
                return {};
            }
            const payload = {};
            Object.keys(settingsJSON['commands_available']).forEach((cmdKey) => {
                // Execution handle for the command.
                const fnc = cmdTemplates[cmdKey](Debug, Strings, Client, Auth, cmdKey);
                if (_.isFunction(cmdTemplates[cmdKey])) {
                    payload[cmdKey] = fnc.execute;
                }
            });
            return payload;
        } catch (e) {
            Debug.print(`Failed to get commands for a guild (${id}).`, 'COMMANDS ERROR', true, e);
            return {};
        }
    }

    return module;
};
