const { print, log } = require('../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');

module.exports = (Settings, Strings, name) => {
  const module = {};
  const authors = {};

  /**
   * Saves the message for the author
   * and returns the author.
   */
  getProcessedAuthor = (Message) => {
    try {
      const { author } = Message;
      const id = author.id;
      if (authors[id]) {
        // An existing user.
        // We use indexes to avoid super long message logs.
        const i = authors[id].messages.index >= 15
          ? 0
          : authors[id].messages.index + 1;
        authors[id].messages.list[i] = Message;
      } else {
        // A new user.
        authors[id] = {
          id,
          messages: {
            list: [Message],
            index: 0,
          },
          violations: 0,
        }
      }
      return authors[id];
    } catch (e) {
      print('getProcessedAuthor failed.', name, true, e);
    }
    return {};
  }

  /**
   * Returns whether a new violation occured.
   */
  isNewViolation = (author) => {
    try {
      return true;
    } catch (e) {
      print('isNewOffence failed.', name, true, e);
    }
    return false;
  }

  doPunish = (Message, member) => {
    try {
      Message.reply('Punished. Booom!');
    } catch (e) {
      print('doPunish failed.', name, true, e);
    }
    return false;
  }

  doWarn = (Message) => {
    try {
      Message.reply('Warned. Booom!');
    } catch (e) {
      print('doWarn failed.', name, true, e);
    }
    return false;
  }

  module.execute = (Message, guildSettings) => {
    try {
      // Save message & read author.
      const author = getProcessedAuthor(Message);
      // Analyse whether the new message is violating
      // spam rules.
      if (isNewViolation(author)) {
        authors[author.id].violations += 1;
        if (authors[author.id].violations > Number(guildSettings['maxViolations'])) {
          // Punish.
          doPunish(Message, Message.member);
          authors[author.id].violations = 0;
        } else if (Boolean(guildSettings['warnings'])) {
          // Warn.
          doWarn(Message);
        }
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  };

  return module;
}
