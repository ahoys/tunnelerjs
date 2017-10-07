const { print, log } = require('../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');
const punish = require('./parts/module.inc.punish')();
const analyse = require('./parts/module.inc.analyse')();

module.exports = (Settings, Strings, name) => {
  const module = {};

  // "authors" includes analysis, warnings and violations of authors.
  // See the template below for knowledge about the inner structure.
  const authors = [];
  const authorTemplate = {
    "joinedTimestamp": 0,
    "analysisObj": {
      "log": [],
      "last": [],
      "sums": [],
      "avg": [],
    },
    "warningCount": 0,
  }
  // How many content lines are being analyzed at once.
  // Decreasing this value will make the module to act more
  // aggressively.
  const maxBuffer = 8;

  /**
   * Appends the given log with a new content.
   * @param {*} authorLog
   * @param {string} content
   * @param {number} createdTimestamp
   */
  const getAppendedLog = (authorLog, content, createdTimestamp) => {
    try {
      const thisLog = authorLog;
      thisLog.push({
        content,
        createdTimestamp,
      });
      if (thisLog.length > maxBuffer) {
        thisLog.shift();
      }
      return thisLog;
    } catch (e) {
      print(`Could not append a log.`, name, true, e);
    }
    return {};
  }

  /**
   * Saves an author.
   * @param {string} id
   * @param {*} data
   */
  const setAuthor = (id, data) => {
    try {
      authors[id] = data;
    } catch (e) {
      print(`Could not set a new author.`, name, true, e);
    }
  }

  /**
   * Returns an author. New or existing.
   * @param {string} id
   * @return {*}
   */
  const getAuthor = (id) => {
    try {
      return authors[id] || authorTemplate;
    } catch (e) {
      print(`Could not return an existing author.`, name, true, e);
    }
    return {};
  }

  /**
   * Validates guild settings.
   * @param {*} guildSettings 
   * @param {*} roles 
   * @param {*} member 
   */
  const isValidSetup = (guildSettings, roles, member) => {
    try {
      const {
        punishment,
        punishmentRole,
        warnings,
        silentMode
      } = guildSettings;
      let replaceType = undefined;
      if (['ban', 'kick', 'role', 'warn'].indexOf(punishment) === -1) {
        // Invalid punishment.
        replaceType = 'warn';
        print('Invalid punishment type.',
          name);
        return false;
      } else if (
        punishment === 'role' &&
        Object.keys(roles).indexOf(punishmentRole) === -1
      ) {
        // Invalid or missing role id.
        replaceType = 'warn';
        print(`Invalid role id (${punishmentRole}). `
          + `See the log for the available ids.`,
          name, true, roles);
        return false;
      } else if (punishment === 'kick' && !member.kickable) {
        // Cannot be kicked.
        print(`Member (${member.nickname}) is not kickable.`,
          name);
        return false;
      } else if (punishment === 'ban' && !member.bannable) {
        // Cannot be banned.
        print(`Member (${member.nickname}) is not bannable.`,
          name);
        return false;
      } else if (typeof warnings !== 'boolean') {
        // Invalid warning.
        print('Invalid warnings. Should be true or false.',
          name);
        return false;
      } else if (typeof silentMode !== 'boolean') {
        // Invalit silentMode.
        print('Invalid silentMode. Should be true or false.',
          name);
        return false;
      }
      return true;
    } catch (e) {
      print('Failed to validate the punishment settings.', name,
        true, e);
    }
    return false;
  }

  /**
   * Processes a correct punishment to a member.
   * @param {object} Message
   * @param {object} guildSettings
   */
  const processPunishment = (Message, guildSettings) => {
    try {
      switch (guildSettings.punishment) {
        case 'ban':
          print(`Banning ${Message.member.nickname}`, name,
            true, Message.member.id);
          punish.ban(Message.member, 1);
          break;
        case 'kick':
          print(`Kicking ${Message.member.nickname}`, name,
            true, Message.member.id);
          punish.kick(Message.member, 1);
          break;
        case 'role':
          print(`Roling ${Message.member.nickname}`, name,
            true, Message.member.id);
          punish.role(Message.member, guildSettings.punishmentRole);
          break;
        case 'warn':
          print(`Warning ${Message.member.nickname}`, name,
            true, Message.member.id);
          punish.warn(Message);
          break;
      }
      return true;
    } catch (e) {
      print('Failed to process a punishment.', name, true, e);
    }
    return false;
  }

  /**
   * Executes the module.
   * @param {object} Message
   * @param {object} guildSettings
   * @return {string}
   */
  module.execute = (Message, guildSettings) => {
    try {
      const {
        author,
        content,
        createdTimestamp,
        member,
        guild
      } = Message;
      // Load the author.
      const thisAuthor = getAuthor(author.id);
      if (thisAuthor.joinedTimestamp === 0) {
        // A new author.
        thisAuthor.joinedTimestamp = member.joinedTimestamp;
      }
      const ao = thisAuthor.analysisObj;
      // Append the author's message log.
      ao.log = getAppendedLog(ao.log, content, createdTimestamp);
      // Analyse the most recent content.
      ao.last = analyse.getAnalysis(ao.log);
      // Summarize all the content.
      ao.sums = analyse.getAppendedSums(
        ao.sums,
        ao.last,
        maxBuffer
      );
      // Get average of the content analysement history.
      ao.avg = analyse.getAnalysisAvg(
        ao.sums[ao.sums.length - 1],
        ao.sums.length
      );
      // Decide whether the author is a spammer.
      const certainty = (analyse.getCertainty(ao.avg, content.length));
      if (
        certainty >= 0.5 &&
        isValidSetup(guildSettings, guild.roles, member)
      ) {
        // Decide how many warnings do we give.
        if (warnings) {
          const givenWarnings = certainty >= 0.8
            ? 1 : certainty >= 0.6
              ? 2 : 3;
          if (thisAuthor.warningCount >= givenWarnings) {
            // Time to punish.
            processPunishment(Message, guildSettings);
          } else {
            // Warn.
            guildSettings.punishment = 'warn';
            processPunishment(Message, guildSettings);
          }
        } else {
          // Always punish, no warnings.
          processPunishment(Message, guildSettings);
        }
      }
      // Save analysis.
      thisAuthor.analysisObj = ao;
      // Save the author with changes.
      setAuthor(author.id, thisAuthor);
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  }

  return module;
}
