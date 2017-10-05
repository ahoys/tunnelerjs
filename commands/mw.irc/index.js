const { print, log } = require('../../util/module.inc.debug')();
const irc = require('node-irc');

module.exports = (Settings, Strings, name) => {
  const module = {};
  let initialized = false;
  let ready = false;
  let ircClient = undefined;
  let botClient = undefined;
  let handlerSettings = {}; // Guild settings for handlers.

  onReady = (channel) => {
    try {
      ready = true;
      ircClient.join(handlerSettings['channel']);
      setTimeout(() => {
        ircClient.say(handlerSettings['channel'], Strings['irc_welcome']);
      }, 1024);
    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  };

  onCHANMSG = (data) => {
    try {
      const { receiver, sender, message } = data;
      console.log(message);
    } catch (e) {
      print('onCHANMSG failed.', name, true, e);
    }
  };

  module.execute = (Message, guildSettings) => {
    try {
      if (ready && Message.channel.id === guildSettings['discordChannel']) {
        // Catch the message and bridge it forward.
        ircClient.say('#tunneler', `<${Message.author.username}> ${Message.content}`);
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  }

  module.initialize = (Client, guildSettings) => {
    try {
      botClient = Client;
      handlerSettings = guildSettings;
      ircClient = new irc(
        guildSettings['ircServer'],
        guildSettings['ircPort'],
        guildSettings['ircNickname'],
        'Discord Bridger',
        guildSettings['ircPassword']
      );
      ircClient.debug = true;
      ircClient.verbosity = 2;
      ircClient.on('ready', onReady);
      ircClient.on('CHANMSG', onCHANMSG);
      ircClient.connect();
      return true;
    } catch (e) {
      print(`Initialization of a middleware (${name}) failed.`, name, true, e);
    }
    return false;
  }

  return module;
}
