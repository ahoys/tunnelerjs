/**
 * Automatic guild loader.
 * Reads the guilds located in guilds folder and maps available
 * localized commands for them.
 *
 * Author: Ari Höysniemi
 * Date: May 6. 2017
 */
const fs = require('fs');
module.exports = (Debug, CommandsMap) => {
    const module = {};
    const guilds = {};
    const {cmdMap, midMap} = CommandsMap;

    /**
     * Reads the available guild files.
     * Discards invalid files.
     * @return {object}
     */
    const getGuildData = () => {
        try {
            const guildData = [];
            const reg = new RegExp(/^\d{18}$/);
            // Each /guilds sub dir should represent a guild.
            fs.readdirSync('./guilds').forEach((dir) => {
                // Each guild should have a special settings file.
                const dirPath = `./guilds/${dir}`;
                const jsonPath = `./guilds/${dir}/guild.json`;
                // Make sure all the required files exist.
                if (
                    reg.test(dir) &&
                    fs.lstatSync(dirPath) &&
                    fs.existsSync(jsonPath)
                ) {
                    const json = require(`.${jsonPath}`);
                    // Construct a data object if everything is OK.
                    if (typeof json === 'object') {
                        guildData.push({
                            id: String(dir),
                            json,
                        });
                    }
                }
            });
            return guildData;
        } catch (e) {
            Debug.print(
                `Reading guild files failed.`,
                `GUILDS ERROR`
            );
            return [];
        }
    };

    /**
     * Returns guild's available commands.
     * @param {string} guildId
     * @param {object} commandsJSON
     * @param {string} langJSON
     * @return {object}
     */
    const getGuildCommands = (guildId, commandsJSON, langJSON) => {
        try {
            // Validate parameters.
            if (
                typeof guildId !== 'string' ||
                typeof commandsJSON !== 'object' ||
                typeof langJSON !== 'string'
            ) return {};
            const guildCommands = {};
            // Collect all command objects.
            Object.keys(commandsJSON).forEach((cmdKey) => {
                // The command must exist.
                if (cmdMap[cmdKey]) {
                    const {settings, strings, jsPath} = cmdMap[cmdKey];
                    // Map all the keywords that can be used to call
                    // the command.
                    const localization = strings.langJSON || strings.default;
                    localization.keywords.forEach((keyword) => {
                        const regKeyword = new RegExp(/^[a-z]{1,18}$/);
                        if (regKeyword.test(keyword)) {
                            // Construct the command object.
                            // Each keyword will have their own instance of
                            // the object.
                            guildCommands[keyword] = {
                                execute: require(`.${jsPath}`)(
                                    Debug, settings, localization, cmdKey
                                ).execute,
                                access: commandsJSON[cmdKey].access || [],
                            };
                        }
                    });
                } else {
                    Debug.log(
                        `Command ${cmdKey} was not found.`,
                        `GUILDS WARN`
                    );
                }
            });
            return guildCommands;
        } catch (e) {
            Debug.print(
                `Reading guild commands failed. The process will now exit.`,
                `GUILDS CRITICAL`, true, e
            );
            process.exit(1);
            return {};
        }
    };

    /**
     * Initializes guilds.
     * @return {object}
     */
    module.initialize = () => {
        try {
            // Generate guilds from files.
            const guildFiles = getGuildData();
            guildFiles.forEach((guild) => {
                const {id, json} = guild;
                // Read all the commands associated to the guild.
                const commands = getGuildCommands(
                    id, json.commands, json.localization || json.default
                );
                if (guilds[id]) {
                    // An existing guild.
                    // Update the existing values.
                    guilds[id].json = json;
                    guilds[id].commands = commands;
                } else {
                    // A new guild.
                    // Create a new guild object.
                    guilds[id] = {
                        json,
                        commands,
                    };
                }
            });
            // Return all the available guilds and their
            // commands.
            return guilds;
        } catch (e) {
            Debug.print(
                `Initializing guilds failed. The process will now exit.`,
                `GUILDS CRITICAL`, true, e
            );
            process.exit(1);
            return {};
        }
    };

    return module;
};
