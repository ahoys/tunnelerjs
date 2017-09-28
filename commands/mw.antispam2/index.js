const { print, log } = require('../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');

module.exports = (Settings, Strings, name) => {
  const module = {};
  const authors = {};

  /**
   * Returns a saved or a new author-
   */
  getAuthor = (Message) => {
    try {
      const { author } = Message;
      const id = author.id;
      if (authors.indexOf(id) === -1) {
        authors[id] = {
          id,
          messages: [],
          warnings: 0,
        }
      }
      return authors[id];
    } catch (e) {
      print('getAuthor failed.', name, true, e);
    }
    return {};
  }

  isNewOffence = (author) => {
    try {

    } catch (e) {
      print('isNewOffence failed.', name, true, e);
    }
    return false;
  }

  module.execute = (Message, guildSettings) => {
    try {
      // Read author.
      const author = getAuthor(Message);
      // Save message.
      authors[author.id].messages.push(Message);
      // Analyse whether the new message is violating
      // spam rules.
      if (isNewOffence(author)) {

      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  };
}
