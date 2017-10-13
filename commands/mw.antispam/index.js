const { print, log } = require('../../util/module.inc.debug')();
const analyse = require('./parts/module.inc.analyse')();

module.exports = (Settings, Strings, name) => {
  const module = {};
  const authors = {};

  /**
   * Saves the message for the author
   * and returns the author.
   */
  getAuthor = (id) => {
    try {
      if (authors[id] && authors[id].messages.index >= 7) {
        // An existing user.
        // We use indexes to avoid super long message logs.
        authors[id].messages.index = 0;
      } else if (!authors[id]) {
        // A new user.
        authors[id] = {
          id,
          messages: {
            list: [],
            index: 0,
          },
          violations: 0,
        }
      }
      return authors[id];
    } catch (e) {
      print(`getAuthor (${id}) failed.`, name, true, e);
    }
    return {};
  }

  setAuthor = (id, author) => {
    try {
      authors[id] = author;
    } catch (e) {
      print(`setAuthor (${id}) failed.`, name, true, e);
    }
  }

  doPunish = (Message, punishment, role, silent) => {
    try {
      const { member, author, channel, guild } = Message;
      switch (punishment) {
        case 'ban':
          if (member.bannable) {
            member.ban({ days: 1, reason: 'Automatic spam detection.' })
            .then(() => {
              print(`Banned "${author.username}".`, name, true);
              if (!silent) channel.send(`${author.username} ${Strings['punished_ban']}`);
            })
            .catch((e) => {
              print('Banning failed.', name, true, e);
            });
          }
        break;
        case 'kick':
          if (member.kickable) {
            member.kick({ days: 1, reason: 'Automatic spam detection.' })
            .then(() => {
              print(`Kicked "${author.username}".`, name, true);
              if (!silent) channel.send(`${author.username} ${Strings['punished_kick']}`);
            })
            .catch((e) => {
              print('Kicking failed.', name, true, e);
            });
          }
        break;
        case 'role':
          const roleObj = guild.roles.find('id', role);
          if (roleObj) {
            member.addRole(roleObj, 'Automatic spam detection')
            .then(() => {
              print(`Set role "${roleObj.name}" to "${author.username}".`, name, true);
              if (!silent) channel.send(`${author.username} ${Strings['punished_role']}`);
            }).catch((e) => {
              print(`Adding a punishment role (${role}) failed.`, name, true, e);
            });
          }
        break;
        case 'warn':
          Message.reply(Strings['warning']);
        break;
      }
    } catch (e) {
      print('doPunish failed.', name, true, e);
    }
  }

  module.execute = (Message, guildSettings) => {
    try {
      // Load the message author.
      const author = getAuthor(Message.author.id);
      // Save the message.
      author.messages.list[author.messages.index] = {
        content: Message.content,
        createdTimestamp: Message.createdTimestamp,
        editedTimestamp: undefined,
        everyone: Message.mentions.everyone,
        analysis: analyse.getMessageAnalysis(Message.content),
      };
      author.messages.index += 1;
      if (analyse.hasViolation(author.messages.list)) {
        // Spam detected.
        // Clear the message buffer. This will make the antispam
        // very reactive against new violations.
        author.messages.list = [];
        author.messages.index = 0;
        const punishment = guildSettings.punishment;
        if (typeof punishment === 'string') {
          // Only a one type of punishment given.
          // Violations are irrelevant.
          doPunish(Message.member, Message.author.username, punishment);
        } else if (
          typeof punishment === 'object' &&
          punishment.constructor === Array
        ) {
          // Steps of punishments. Violation points
          // what punishment comes next.
          if (
            ['warning', 'role', 'kick', 'ban']
            .indexOf(punishment[author.violations] !== -1)
          ) {
            // Punishment found.
            // If not found, it means that the first
            // violation will be tolerated.
            doPunish(
              Message,
              punishment[author.violations],
              guildSettings.punishmentRole,
              guildSettings.silentMode
            );
          }
          author.violations += 1;
          if (author.violations >= punishment.length) {
            // All punishments are now given.
            if (guildSettings.cyclePunishments) {
              // Start a new punishment round.
              author.violations = 0;
            }
          }
        }
      }
      // Save the author.
      setAuthor(Message.author.id, author);
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  };

  return module;
}
