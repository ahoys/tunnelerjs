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
   * @param {object} params
   */
  module.execute = (Message, Client, params) => {
    try {
      // How many lines to search. Max is 100.
      const linesCountStr = params[0];
      const linesCount = Number(linesCountStr);
      // Text to looked for. This will identificate what will be removed.
      const queryText = params.filter((p, i) => i > 0).join(' ');
      if (queryText !== '' && !isNaN(linesCount) && linesCount > 0 && linesCount <= 100) {
        const ch = Message.channel;
        ch.fetchMessages({ limit: linesCount })
        .then(messages => {
          const toBeRemoved = messages.filter(val => val.content.includes(queryText)).array();
          toBeRemoved.forEach(Message => {
            Message.delete();
          });
        })
        .catch(() => {
          Message.reply(Strings['fail_1']);
        });
      } else if (linesCount > 100) {
        Message.reply(Strings['fail_max100']);
      } else {
        Message.reply(Strings['fail_0']);
      }
    } catch (e) {
      print(`Command execution failed.`, name, true, e);
    }
  };

  return module;
};
