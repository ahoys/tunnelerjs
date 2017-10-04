const { print, log } = require('../../util/module.inc.debug')();
const irc = require('node-irc');

module.exports = (Settings, Strings, name) => {
  const module = {};
  const client = new irc('se.quakenet.org', 6667, 'Tunneler', 'fn');
  client.debug = true;
  client.verbosity = 2;
  let initialized = false;
  let ready = false;

  client.on('ready', () => {
    console.log('noniin');
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
      if (ready && initialized) {
        // Catch the message and bridge forward.
        client.say('#tunneler', `<${Message.author.username}> ${Message.content}`);
      } else if (!initialized) {
        // Connect the client.
        initialized = true;
        client.connect();
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  }

  return module;
}
