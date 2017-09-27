const {print, log} = require('../../util/module.inc.debug')();

/**
 * Restarts the bot.
 *
 * Author: Ari Höysniemi
 * Date: Sep 27. 2017
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
   * @param {object} Client
   * @return {string}
   */
  module.execute = (Message, Client) => {
    try {
      const { author } = Message;
      log(`Message author (${author.username}, ${author.id}) `
      + `rebooted the bot.`);
      Message.reply(`${Strings['success_0']}`);
      setTimeout(() => {
        Client.destroy();
        process.exit(3);
      }, 1024);
    } catch (e) {
        print(`Command execution failed.`, name, true, e);
    }
    return '';
  };

  return module;
};
