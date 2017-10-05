const { print, log } = require('../../util/module.inc.debug')();
const StrA = require('string-analysis-js');

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
  isNewViolation = (author, Message) => {
    try {
      const { content } = Message;
      console.log(Settings);
      const rStructure = StrA.getPercentageOfRepetitiveStructure(
        content, Settings['splitter']);
      const pOfShortStrings = StrA.getPercentageOfShortStrings(
        content, Settings['shortWordLength']);
      const pOfLongStrings = StrA.getPercentageOfLongStrings(
        content, Settings['longWordLength']);
      const pOfRepetitiveChars = StrA.getPercentageOfRepetitiveChars(
        content, Settings['repetitiousChars']);
      console.log(rStructure, pOfShortStrings, pOfLongStrings, pOfRepetitiveChars);
      return true;
    } catch (e) {
      print('isNewOffence failed.', name, true, e);
    }
    return false;
  }

  /**
   * Punishes the Message author based on
   * guildSettings.
   */
  doPunish = (Message, guildSettings) => {
    try {
      const { guild, author, member, channel } = Message;
      const {
        punishmentType,
        punishmentRole,
        daysToClear,
      } = guildSettings;
      const dtc = typeof daysToClear === 'number' ? daysToClear : 0;
      switch (punishmentType) {
        case 'ban':
          // Make sure the member is bannable.
          if (member.bannable) {
            member.ban({ days: dtc, reason: 'Automatic spam detection.'})
            .then(() => {
              channel.send(`${author.username} ${Strings['punished_ban']}`);
              print(`Banned "${author.username}".`, name, true);
            }).catch((e) => {
              print('Banning failed.', name, true, e);
            });
          }
          break;
        case 'kick':
          // Make sure the member is kickable.
          if (member.kickable) {
            member.kick(dtc, 'Automatic spam detection')
            .then(() => {
              channel.send(`${author.username} ${Strings['punished_kick']}`);
              print(`Kicked "${author.username}".`, name, true);
            }).catch((e) => {
              print('Kicking failed.', name, true, e);
            });
          }
          break;
        case 'role':
          // Make sure the role exists, and that the member does not already
          // has the role.
          const role = guild.roles.find('id', punishmentRole);
          if (role) {
            member.addRole(role, 'Automatic spam detection')
            .then(() => {
              channel.send(`${author.username} ${Strings['punished_role']}`);
              print(`Set role "${role.name}" to "${author.username}".`, name, true);
            }).catch((e) => {
              print(`Adding punishment role (${punishmentRole}) failed.`, name, true, e);
            });
          }
          break;
      }
    } catch (e) {
      print('doPunish failed.', name, true, e);
    }
    return false;
  }

  module.execute = (Message, guildSettings) => {
    try {
      // Save message & read author.
      const author = getProcessedAuthor(Message);
      // Analyse whether the new message is violating
      // spam rules.
      if (isNewViolation(author, Message)) {
        authors[author.id].violations += 1;
        if (authors[author.id].violations > Number(guildSettings['maxViolations'])) {
          // Punish.
          doPunish(Message, guildSettings);
          authors[author.id].violations = 0;
        } else if (Boolean(guildSettings['warnings'])) {
          // Warn.
          Message.reply(Strings['warning']);
        }
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  };

  return module;
}
