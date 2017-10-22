const { print, log } = require('../util/module.inc.debug')();
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
  const { cmdMap, mwMap } = CommandsMap;

  /**
   * Returns guild's available commands.
   * @param {object} commandsJSON
   * @param {string} langJSON
   * @return {object}
   */
  const getGuildCommands = (commandsJSON, langJSON) => {
    try {
      // Validate parameters.
      if (
        typeof commandsJSON !== 'object' ||
        typeof langJSON !== 'string'
      ) return {};
      const guildCommands = {};
      // Collect all command objects.
      Object.keys(commandsJSON).forEach((cmdKey) => {
        // The command must exist.
        if (cmdMap[cmdKey] && commandsJSON[cmdKey].enabled) {
          const { globalSettings, strings, jsPath } = cmdMap[cmdKey];
          // Map all the keywords that can be used to call
          // the command.
          const localization = strings[langJSON] ||
            strings['default'];
          // Command's name can always be used as a keyword.
          localization.keywords.push(cmdKey);
          localization.keywords.forEach((keyword) => {
            const regKeyword = new RegExp(/^[a-zA-ZäÄöÖåÅæÆøØ]{1,24}$/);
            if (regKeyword.test(keyword)) {
              // Construct the command object.
              // Each keyword will have their own instance of
              // the object.
              guildCommands[keyword] = {
                execute: require(`.${jsPath}`)(
                  globalSettings, localization, cmdKey
                ).execute,
                access: Parser.getListOfType(
                  commandsJSON[cmdKey]['access']),
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
          const { jsPath, strings, globalSettings } = mwMap[mwKey];
          const localization = strings[langJSON] ||
            strings['default'];
          const mwObj = require(`.${jsPath}`)(
            globalSettings, localization, mwKey);
          guildMiddlewares[mwKey] = {
            execute: mwObj.execute,
            control: mwObj.control,
            initialize: mwObj.initialize,
            access: Parser.getListOfType(
              middlewaresJSON[mwKey]['access']),
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
   * Returns all the available guilds.
   * @return {array}
   */
  module.getGuildsData = () => {
    try {
      const guilds = [];
      const reg = new RegExp(/^\d{18}$/);
      fs.readdirSync('./guilds')
        .filter(
        x => reg.test(x) &&
          fs.lstatSync(`./guilds/${x}`).isDirectory())
        .forEach((id) => {
          const json = require(`./${id}/guild.json`);
          if (typeof json === 'object') {
            guilds.push({ id, json })
          }
        });
      return guilds;
    } catch (e) {
      print('Could not get the guilds.', 'guilds', true, e);
    }
    return [];
  };

  /**
   * Initializes guilds.
   * @return {object}
   */
  module.initialize = () => {
    try {
      // Get the guild data for further processing.
      module.getGuildsData().forEach((guild) => {
        guilds[guild.id] = {
          commands: getGuildCommands(
            guild.json.commands, guild.json.localization),
          middlewares: getGuildMiddlewares(
            guild.json.middlewares, guild.json.localization),
        }
      });
      // Return all the available guilds with commands.
      return guilds;
    } catch (e) {
      print(
        `Initializing guilds failed. The process will now exit.`,
        'guilds', true, e
      );
      process.exit(1);
    }
    return {};
  };

  return module;
};
