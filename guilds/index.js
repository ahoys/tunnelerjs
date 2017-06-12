const {print, log} = require('../util/module.inc.debug')();
const Parser = require('../util/module.inc.parser')();
const fs = require('fs');

/**
 * Automatic guild loader.
 * Reads the guilds located in guilds folder and maps available
 * localized commands for them.
 *
 * Author: Ari Höysniemi
 * Date: May 6. 2017
 * @param {object} CommandsMap
 * @return {object}
 */
module.exports = (CommandsMap) => {
    const module = {};
    const guilds = {};
    const {cmdMap, mwMap} = CommandsMap;

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
            print(
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
                if (cmdMap[cmdKey] && commandsJSON[cmdKey].enabled) {
                    const {settings, strings, jsPath} = cmdMap[cmdKey];
                    // Map all the keywords that can be used to call
                    // the command.
                    const localization = strings[langJSON] ||
                        strings['default'];
                    localization.keywords.forEach((keyword) => {
                        const regKeyword = new RegExp(/^[a-z]{1,18}$/);
                        if (regKeyword.test(keyword)) {
                            // Construct the command object.
                            // Each keyword will have their own instance of
                            // the object.
                            guildCommands[keyword] = {
                                execute: require(`.${jsPath}`)(
                                    settings, localization, cmdKey
                                ).execute,
                                access: Parser.getListOfType(
                                    commandsJSON[cmdKey].access),
                                enabledChannels: Parser.getListOfType(
                                    commandsJSON[cmdKey]['enabled_channels']),
                                excludedChannels: Parser.getListOfType(
                                    commandsJSON[cmdKey]['excluded_channels']),
                                enabledAuthors: Parser.getListOfType(
                                    commandsJSON[cmdKey]['enabled_authors']),
                                excludedAuthors: Parser.getListOfType(
                                    commandsJSON[cmdKey]['excluded_authors']),
                                enabledRoles: Parser.getListOfType(
                                    commandsJSON[cmdKey]['enabled_roles']),
                                excludedRoles: Parser.getListOfType(
                                    commandsJSON[cmdKey]['excluded_roles']),
                                guildSettings: commandsJSON[cmdKey]['settings'],
                            };
                        }
                    });
                } else {
                    log(
                        `Command ${cmdKey} was not found.`,
                        `GUILDS WARN`
                    );
                }
            });
            return guildCommands;
        } catch (e) {
            print(
                `Reading guild commands failed. The process will now exit.`,
                `GUILDS CRITICAL`, true, e
            );
            process.exit(1);
            return {};
        }
    };

    /**
     * Returns guild's available middlewares.
     * @param {object} middlewaresJSON
     * @return {object}
     */
    const getGuildMiddlewares = (middlewaresJSON, langJSON) => {
        try {
            if (
                typeof middlewaresJSON !== 'object' ||
                typeof langJSON !== 'string'
            ) return {};
            const guildMiddlewares = {};
            Object.keys(middlewaresJSON).forEach((mwKey) => {
                if (mwMap[mwKey] && middlewaresJSON[mwKey].enabled) {
                    const {jsPath, strings, settings} = mwMap[mwKey];
                    const localization = strings[langJSON] ||
                        strings['default'];
                    guildMiddlewares[mwKey] = {
                        execute: require(`.${jsPath}`)(
                            settings, localization, mwKey).execute,
                        enabledChannels: Parser.getListOfType(
                            middlewaresJSON[mwKey]['enabled_channels']),
                        excludedChannels: Parser.getListOfType(
                            middlewaresJSON[mwKey]['excluded_channels']),
                        enabledAuthors: Parser.getListOfType(
                            middlewaresJSON[mwKey]['enabled_authors']),
                        excludedAuthors: Parser.getListOfType(
                            middlewaresJSON[mwKey]['excluded_authors']),
                        enabledRoles: Parser.getListOfType(
                            middlewaresJSON[mwKey]['enabled_roles']),
                        excludedRoles: Parser.getListOfType(
                            middlewaresJSON[mwKey]['excluded_roles']),
                        guildSettings: middlewaresJSON[mwKey]['settings'],
                    };
                }
            });
            return guildMiddlewares;
        } catch (e) {
            print(
                `Reading guild middlewares failed. The process will now exit.`,
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
                guilds[id] = {
                    json,
                    commands: getGuildCommands(
                        id, json.commands, json.localization || json.default),
                    middlewares: getGuildMiddlewares(
                        json.middlewares, json.localization || json.default),
                };
            });
            // Return all the available guilds with commands.
            return guilds;
        } catch (e) {
            print(
                `Initializing guilds failed. The process will now exit.`,
                `GUILDS CRITICAL`, true, e
            );
            process.exit(1);
            return {};
        }
    };

    return module;
};
