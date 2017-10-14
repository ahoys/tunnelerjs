const { print, log } = require('../../util/module.inc.debug')();
const irc = require('node-irc');

module.exports = (Settings, Strings, name) => {
  const module = {};
  let ready = false;
  let ircClient = undefined;
  let discordClient = undefined;
  let handlerSettings = {};

  /**
   * Ready handler.
   */
  onReady = () => {
    try {
      ready = true;
      ircClient.join(handlerSettings['ircChannel']);
      setTimeout(() => {
        ircClient.say(handlerSettings['ircChannel'], Strings['irc_welcome']);
      }, 1024);
    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  };

  /**
   * IRC message handler.
   * @param {data} object
   */
  onCHANMSG = (data) => {
    try {
      discordClient.send(`<${data.sender}> ${data.message}`);
    } catch (e) {
      print('onCHANMSG failed.', name, true, e);
    }
  };

  /**
   * IRC part handler.
   */
  onPART = (data) => {
    try {
      if (ready) {
        print(`Unexpected /part with a message: ${data.message}.`, name, true);
      }
      ircClient.quit();
    } catch (e) {
      print('onPART failed.', name, true, e);
    }
  }

  /**
   * IRC quit handler.
   */
  onQUIT = (data) => {
    try {
      if (ready) {
        print(`Unexpected /quit with a message: ${data.message}`, name, true);
      }
    } catch (e) {
      print('onQUIT failed.', name, true, e);
    }
  }

  /**
   * Attempt to handle irc-based errors.
   * @param {string} err
   */
  handleErrors = (err) => {
    try {
      if (err.indexOf('This socket has been ended by the other party') !== -1) {
        ready = false;
        ircClient.quit();
      }
    } catch (e) {
      print('handleErrors failed.', name, true, e);
    }
  }

  /**
   * Discord message handler.
   * @param {object} Message
   * @param {object} guildSettings
   */
  module.execute = (Message, guildSettings) => {
    try {
      if (Message.content === '/irc-quit' && Message.author.id === guildSettings['ownerId']) {
        // Owner asked to quit.
        ready = false;
        ircClient.quit();
        Message.reply(Strings['dc_quit']);
        print(`Irc connection closed by "${Message.author.username}".`, name, true);
      } else if (Message.content === '/irc-connect' && Message.author.id === guildSettings['ownerId']) {
        // Owner asked to connect.
        if (ready) {
          Message.reply(Strings['dc_already_connected']);
        } else {
          ircClient.connect();
          ready = true;
          Message.reply(Strings['dc_connecting']);
        }
      } else if (ready && Message.channel.id === discordClient.id) {
        // Catch the message and bridge it forward.
        ircClient.say(
          guildSettings['ircChannel'],
          `<${Message.author.username}> ${Message.content}`
        );
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
      handleErrors(e);
    }
    return '';
  }

  /**
   * Initializes the middleware.
   * @param {object} Guild
   * @param {object} guildSettings
   */
  module.initialize = (Guild, guildSettings) => {
    try {
      const {
        ircServer,
        ircPort,
        ircNickname,
        ircPassword,
        ircChannel,
        discordChannel,
        ownerId,
      } = guildSettings;
      // Make sure that all the required settings exist.
      if (typeof ircServer !== 'string') {
        print('Missing guild setting "ircServer" or invalid type.', name, true);
        return false;
      }
      if (typeof ircPort !== 'number') {
        print('Missing guild setting "ircPort" or invalid type.', name, true);
        return false;
      }
      if (typeof ircNickname !== 'string') {
        print('Missing guild setting "ircNickname" or invalid type.', name, true);
        return false;
      }
      if (typeof ircPassword !== 'string') {
        print('Missing guild setting "ircChannel" or invalid type.', name, true);
        return false;
      }
      if (typeof discordChannel !== 'string') {
        print('Missing guild setting "discordChannel" or invalid type.', name, true);
        return false;
      }
      if (typeof ownerId !== 'string') {
        print('Missing guild setting "ownerId" or invalid type.', name, true);
        return false;
      }
      // Make sure the given discord channel exists.
      const channel = Guild.channels
        .find(x => x.id === discordChannel);
      if (channel) {
        discordClient = channel;
        handlerSettings = guildSettings;
        ircClient = new irc(
          ircServer,
          ircPort,
          ircNickname,
          'Tunnelerjs',
          ircPassword
        );
        ircClient.debug = true;
        ircClient.verbosity = 2;
        ircClient.on('ready', onReady);
        ircClient.on('CHANMSG', onCHANMSG);
        ircClient.on('PART', onPART);
        ircClient.on('QUIT', onQUIT);
        ircClient.connect();
        return true;
      } else {
        print(`Discord channel "${discordChannel}" does not exist.`, name, true);
      }
    } catch (e) {
      print(`Initialization of a middleware (${name}) failed.`, name, true, e);
    }
    return false;
  }

  return module;
}
