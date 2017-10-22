const {print} = require('../../util/module.inc.debug')();

/**
 * Replies with a bot uptime.
 * Reboot does not clear the timer.
 * 
 * Author: Ari Höysniemi
 * Data: October 7. 2017
 * @param {object} Settings
 * @param {object} Strings
 * @param {string} name
 * @return {object}
 */
module.exports = (Settings, Strings, name) => {
  const module = {};

  /**
   * Executes the command.
   * @param {object} Message
   */
  module.execute = (Message) => {
    try {
      const uptime = process.uptime();
      if (uptime < 60) {
        // Seconds
        Message.reply(`${Strings['success_0']} `
        + `${Math.floor(process.uptime())} ${Strings['seconds']}.`);
      } else if (uptime >= 60 && uptime < 3600) {
        // Minutes
        Message.reply(`${Strings['success_0']} `
        + `${Math.floor((process.uptime() / 60))} ${Strings['minutes']}.`);
      } else if (uptime >= 3600 && uptime < 68400) {
        // Hours
        Message.reply(`${Strings['success_0']} `
        + `${Math.floor((process.uptime() / 3600))} ${Strings['hours']}.`);
      } else {
        // Days
        Message.reply(`${Strings['success_0']} `
        + `${Math.floor((process.uptime() / 68400))} ${Strings['days']}.`);
      }
    } catch (e) {
      print(`Command execution failed.`, name, true, e);
    }
  };

  return module;
};
