const {print, log} = require('../../util/module.inc.debug')();

module.exports = (Settings, Strings, name) => {
  const module = {};
  const failedAttempts = {};
  const silentModeSetting = true;

  /**
   * Verifies how many times the author has failed.
   * If the author fails too many times, he will be kicked (if set so).
   */
  verifyAttempts = (Message, failedAttempt = false, maxAttempts = 3) => {
    try {
      const { member, author } = Message;
      const { id } = author;
      const attempts = failedAttempts[id];
      if (attempts && failedAttempt) {
        // The author has now failed multiple times.
        failedAttempts[id] += 1;
        removeMessage(Message);
        if (attempts >= maxAttempts - 1) {
          member.kick('Sent too many messages after just joining the server. A bot perhaps?');
        }
      } else if (failedAttempt) {
        // This is the first failed message for the author.
        failedAttempts[id] = 1;
        removeMessage(Message);
      } else if (attempts && !failedAttempt) {
        // The author is now clean.
        failedAttempts[id] = 0;
      }
    } catch (e) {
      print('verifyAttempts failed.', name, true, e);
    }
  };

  /**
   * Removes the message.
   */
  removeMessage = (Message) => {
    try {
      const { author } = Message;
      if (!silentModeSetting) {
        Message.reply(Strings['msg_removed']);
      }
      Message.delete();
      log(`Removed a message from ${author.username} (${author.id}). Recognized to be a bot: ${author.bot}.`, name);
    } catch (e) {
      print('removeMessage failed.', name, true, e);
    }
  };

  /**
   * Will initialize removeMessage if the user has sent the message too soon.
   */
  checkTimestamps = (Message, noTalkTimeInSeconds = 1, maxAttempts) => {
    try {
      const { member, author } = Message;
      const noTalkInMs = noTalkTimeInSeconds * 1000;
      const joined = member.joinedTimestamp;
      const now = new Date().getTime();
      if (now - joined < noTalkInMs) {
        // Talked too soon!
        verifyAttempts(Message, true, maxAttempts);
      } else if (failedAttempts[author.id]) {
        // Already failed once or more.
        verifyAttempts(Message, false, maxAttempts);
      }
    } catch (e) {
      print('checkTimestamps failed.', name, true, e);
    }
  }
  
  /**
   * Every message is checked here.
   */
  module.execute = (Message, Client, guildSettings) => {
    try {
      const { author } = Message;
      const { noTalkTimeInSeconds, neverAllowBotsToSpeak, checkOnlyRecognizedBots, maxAttempts } = guildSettings;
      const isBot = author.bot;
      if (neverAllowBotsToSpeak && isBot) {
        removeMessage(Message);
      } else if (checkOnlyRecognizedBots && isBot) {
        checkTimestamps(Message, noTalkTimeInSeconds, maxAttempts);
      } else if (!checkOnlyRecognizedBots) {
        checkTimestamps(Message, noTalkTimeInSeconds, maxAttempts);
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  };

  /**
   * Initializes the module by setting the guild level silentMode.
   */
  module.initialize = (Guild, guildSettings) => {
    try {
      silentModeSetting = typeof guildSettings.silentMode === 'boolean'
        ? guildSettings.silentMode
        : true;
    } catch (e) {
      print(`Could not initialize a middleware (${name}).`, name, true, e);
    }
  };

  return module;
};
