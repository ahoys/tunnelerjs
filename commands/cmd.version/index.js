const {print} = require('../../util/module.inc.debug')();

/**
 * Replies with the Tunneler version.
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
   */
  module.execute = (Message) => {
    try {
      const packageJSON = require('../../package.json');
      const version = packageJSON.version;
      if (!version) {
        Message.reply(Strings['fail_0']);
      }
      Message.reply(`v.${version}`);
    } catch (e) {
        print(`Command execution failed.`, name, true, e);
    }
  };

  return module;
};
