const {print} = require('../../util/module.inc.debug')();

/**
 * Replies with information about Tunneler.
 *
 * Author: Ari Höysniemi
 * Date: Oct 22. 2017
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
   * @param {Array} params
   */
  module.execute = (Message, Client, params) => {
    try {
      const packageJSON = require('../../package.json');
      let msg = '';
      if (params && params.length) {
        // User requested parameters.
        const found = params.filter((x) => typeof packageJSON[x] === 'string');
        const len = found.length;
        found.forEach((param, i) => {
          msg += i + 1 < len
            ? `${param}: ${packageJSON[param]}, `
            : `${param}: ${packageJSON[param]}.`;
        });
      }
      if (typeof msg !== 'string' || !msg.length) {
        // No valid parameters, just return the version.
        if (packageJSON.description && packageJSON.version) {
          msg = `I'm ${packageJSON.description.toLowerCase()}`;
        } else {
          msg = Strings['fail_0'];
        }
      }
      Message.reply(msg);
    } catch (e) {
      print(`Command execution failed.`, name, true, e);
    }
  };

  return module;
};
