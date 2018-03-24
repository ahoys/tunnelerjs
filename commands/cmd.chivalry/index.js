const {print} = require('../../util/module.inc.debug')();

/**
 * Chivalry side assignment command.
 * With this command the server users can pick their chivalry side.
 *
 * Author: Ari Höysniemi
 * Date: Mar 24. 2018
 *
 * @param {object} Settings
 * @param {object} Strings
 * @param {string} name
 * @return {object}
 */
module.exports = (Settings, Strings, name) => {
  const module = {};

  /**
   * Returns the requested chivalry role.
   * @param {*} roles
   * @param {*} faction
   * @return {role}
   */
  const getRole = (roles, faction) => {
    let role;
    if (faction === 'mason') {
      const masonRoles = Settings.masonRoles.map((x) => x.toLowerCase());
      role = roles.find((Role) => masonRoles.indexOf(Role.name.toLowerCase()) !== -1);
    } else {
      const agathaRoles = Settings.agathaRoles.map((x) => x.toLowerCase());
      role = roles.find((Role) => agathaRoles.indexOf(Role.name.toLowerCase()) !== -1);
    }
    return role;
  };

  /**
   * Executes the command.
   * @param {object} Message : Discord.js Message object.
   * @param {object} Client : Discord.js Client object (the bot).
   * @param {Array} params : Additional user inputted parameters for the command.
   * @return {*}
   */
  module.execute = (Message, Client, params) => {
    try {
      const guildMember = Message.member;
      if (
        typeof params !== 'object'
        || typeof params[0] !== 'string'
        || !guildMember
      ) return null;
      const faction = params[0].toLowerCase();
      if (Settings.masonKeywords.indexOf(faction) !== -1) {
        // Mason!
        const role = getRole(Message.guild.roles, 'mason');
        const removeRole = getRole(Message.guild.roles, 'agatha');
        if (role && !guildMember.roles.find((x) => x === role)) {
          print(`Member ${guildMember.id} joined Mason!`, name, false);
          if (removeRole) {
            guildMember.removeRole(removeRole);
          }
          guildMember.addRole(role);
        }
      } else if (Settings.agathaKeywords.indexOf(faction) !== -1) {
        // Agatha!
        const role = getRole(Message.guild.roles, 'agatha');
        const removeRole = getRole(Message.guild.roles, 'mason');
        if (role && !guildMember.roles.find((x) => x === role)) {
          print(`Member ${guildMember.id} joined Agatha!`, name, false);
          if (removeRole) {
            guildMember.removeRole(removeRole);
          }
          guildMember.addRole(role);
        }
      }
    } catch (e) {
      print(`Command execution failed.`, name, true, e);
    }
  };

  return module;
};
