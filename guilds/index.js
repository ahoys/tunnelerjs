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

    /**
     * Loads settings and commands for the guilds.
     * Can be run multiple times if a refresh is needed, only the
     * settings and commands will be overridden.
     * @returns {object} : a map of guilds.
     */
    module.initialize = () => {
        try {
            const files = fs.readdirSync('./guilds');
            const reg = new RegExp(/^\d{18}$/);
            files.forEach((guild) => {
                const guildPath = `./guilds/${guild}`;
                // Only folders with 18 char digit names are allowed.
                if (reg.test(guild) && fs.lstatSync(guildPath).isDirectory()) {
                    const settingsPath = `./guilds/${guild}/guild.json`;
                    if (fs.existsSync(settingsPath)) {
                        // Settings exist, verify.
                        const guildJSON = require(`.${settingsPath}`);
                        if (typeof guildJSON === 'object') {
                            // Map commands for the guild.
                            const commands = {};
                            const commandsJSON = guildJSON["commands"];
                            const localizationJSON = guildJSON["localization"] || "default";
                            if (typeof commandsJSON === 'object' && typeof localizationJSON === 'string') {
                                Object.keys(commandsJSON).forEach((cmdKey) => {
                                    if (CommandsMap[cmdKey]) {
                                        // The command object for the guild includes the following:
                                        // 1. Execution handle with localized strings.
                                        // 2. Access array to the command.
                                        // 3: Keywords array to the command.
                                        const settingsJSON = CommandsMap[cmdKey].settings;
                                        const stringsJSON = CommandsMap[cmdKey].strings[localizationJSON] || CommandsMap[cmdKey].strings["default"];
                                        stringsJSON['keywords'].forEach((keyword) => {
                                            const regKeyword = new RegExp(/^[a-z]{1,18}$/);
                                            if (regKeyword.test(keyword)) {
                                                commands[keyword] = {
                                                    execute: require(`.${CommandsMap[cmdKey].jsPath}`)(Debug, settingsJSON, stringsJSON, cmdKey).execute,
                                                    access: commandsJSON[cmdKey].access || [],
                                                }
                                            } else {
                                                Debug.log(`A specified keyword (${keyword}) is not valid. It should be a-z, 1-18 chars and all lower case.`, 'GUILDS WARN');
                                            }
                                        });
                                    } else {
                                        Debug.log(`Specified command (${cmdKey}) was not found.`, 'GUILDS WARN');
                                    }
                                });
                            } else {
                                Debug.log(`Guild (${guild}) has no commands or localization set in settings.json.`, 'GUILDS WARN');
                            }
                            // The final guild object incldues a shortcut to the loaded json
                            // and the available localized commands object.
                            if (guilds[String(guild)]) {
                                guilds[guild].json = guildJSON;
                                guilds[guild].commands = commands;
                            } else {
                                guilds[String(guild)] = {
                                    json: guildJSON,
                                    commands,
                                }
                            }
                        } else {
                            Debug.print(`Invalid guild file for a guild (${guild}).`, 'GUILDS ERROR');
                        }
                    } else {
                        Debug.print(`File guild.json for a guild (${guild}) is missing.`, 'GUILDS ERROR');
                    }
                }
            });
            Debug.print(`Guilds [${Object.keys(guilds)}] registered.`, 'GUILDS', false);
            Debug.print('Guilds successfully configured.', 'GUILDS', false);
            return guilds;
        } catch (e) {
            Debug.print('Initializing guilds failed. The process will now exit.', 'GUILDS CRITICAL', true, e);
            process.exit(1);
        }
    }

    return module;
}
