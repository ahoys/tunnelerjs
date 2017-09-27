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
   * @param {object} Client
   * @return {string}
   */
  module.execute = (Message, Client) => {
    try {
      const package = require('../../package.json');
      const version = package.version;
      if (!version) {
        return Strings['fail_0'];
      }
      return `v.${version}`;
    } catch (e) {
        print(`Command execution failed.`, name, true, e);
    }
    return '';
  };

  return module;
};
