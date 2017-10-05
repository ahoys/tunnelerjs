const { print, log } = require('../../util/module.inc.debug')();
const irc = require('node-irc');

module.exports = (Settings, Strings, name) => {
  const module = {};
  const client = new irc('se.quakenet.org', 6667, 'Tunneler', 'Discord Bridger');
  client.debug = true;
  client.verbosity = 2;
  let initialized = false;
  let ready = false;

  client.on('ready', () => {
    try {
      ready = true;
      client.join('#tunneler');
      setTimeout(() => {
        client.say(Strings['irc_welcome']);
      }, 1024);
    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  });

  client.on('CHANMSG', (data) => {
    try {
      const { receiver, sender, message } = data;
      console.log(message);
    } catch (e) {
      print('onCHANMSG failed.', name, true, e);
    }
  });

  module.execute = (Message, guildSettings) => {
    try {
      if (ready && Message.channel.id === guildSettings['discordChannel']) {
        // Catch the message and bridge it forward.
        client.say('#tunneler', `<${Message.author.username}> ${Message.content}`);
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  }

  module.initialize = (guildSettings) => {
    try {
      //client.connect();
      return true;
    } catch (e) {
      print(`Initialization of a middleware (${name}) failed.`, name, true, e);
    }
    return false;
  }

  return module;
}
