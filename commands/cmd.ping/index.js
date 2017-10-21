const {print} = require('../../util/module.inc.debug')();

/**
 * Replies with a client ping.
 *
 * Author: Ari Höysniemi
 * Date: May 6. 2017
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
   */
  module.execute = (Message, Client) => {
    try {
      const ping = Math.round(Client.ping);
      if (ping >= 300) {
        Message.reply(`${Strings['success_0']} ${ping} ms. ${Strings['high_ping_1']}`);
      } else if (ping >= 200) {
        Message.reply(`${Strings['success_0']} ${ping} ms. ${Strings['high_ping_0']}`);
      }
      Message.reply(`${Strings['success_0']} ${ping} ms.`);
    } catch (e) {
      print(`Command execution failed.`, name, true, e);
    }
  };

  return module;
};
