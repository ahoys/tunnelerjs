const {print} = require('../../util/module.inc.debug')();
const NodeIrc = require('node-irc');

module.exports = (Settings, Strings, name) => {
  const module = {};
  const settings = {};
  const ircBroadcasts = {}; // Irc channels and to where they broadcast.
  const discordBroadcasts = {}; // Discord channels and to where they broadcast.
  let ircClient;
  const flags = {
    '::p': 'present',
    '::i': 'ignore',
    '::q': 'quit',
  };

  /**
   * Ready handle.
   * Triggered when the IRC client has connected.
   */
  module.onReady = () => {
    try {

    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  };

  /**
   * On channel message handle.
   * Triggered on a new IRC channel message.
   */
  module.onCHANMSG = () => {
    try {

    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  };

  const getStatus = () => {
    try {
      return true;
    } catch (e) {
      print('getStatus failed.', name, true, e);
    }
  };

  const handleStatus = (key, params) => {
    try {
      console.log('handleStatus');
    } catch (e) {
      print('handleStatus failed.', name, true, e);
    }
  };

  const handleConnect = (key, params) => {
    try {
      console.log('handleConnect');
    } catch (e) {
      print('handleConnect failed.', name, true, e);
    }
  };

  const handleDisconnect = (key, params) => {
    try {
      console.log('handleDisconnect');
    } catch (e) {
      print('handleDisconnect failed.', name, true, e);
    }
  };

  const handlePresent = (key, params) => {
    try {
      console.log('handlePresent');
    } catch (e) {
      print('handlePresent failed.', name, true, e);
    }
  };

  /**
   * Discord message handler.
   * @param {object} Message
   * @param {object} Client
   * @param {object} guildSettings
   * @return {string}
   */
  module.execute = (Message, Client, guildSettings) => {
    try {
      const {content, channel} = Message;
      if (
        getStatus() &&
        Object.keys(discordBroadcasts).indexOf(channel.id) !== -1 &&
        typeof content === 'string' &&
        content.trim().length > 0
      ) {
        console.log(discordBroadcasts[channel.id]);
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  };

  /**
   * Command handler.
   * @param {object} Message
   * @param {object} Client
   * @param {array} params
   * @param {object} guildSettings
   */
  module.control = (Message, Client, params, guildSettings) => {
    try {
      const key = params.length && params[0] !== undefined ? params[0] : '';
      const validKeys = {
        status: handleStatus,
        connect: handleConnect,
        disconnect: handleDisconnect,
        present: handlePresent,
      };
      if (Object.keys(validKeys).indexOf(key) !== -1) {
        validKeys[key](key, params);
      }
    } catch (e) {
      print(`Could not execute a middleware control (${name}).`, name, true, e);
    }
  };

  /**
   * Initializes the middleware.
   * @param {object} Guild
   * @param {object} guildSettings
   * @return {boolean} true if success and the mw can be used.
   */
  module.initialize = (Guild, guildSettings) => {
    try {
      const {irc, discord} = guildSettings;
      // Process valid irc broadcasts.
      if (irc && typeof irc.broadcasts === 'object') {
        Object.keys(irc.broadcasts).forEach((ircChannel) => {
          const discordChannels = typeof irc.broadcasts[ircChannel] === 'string'
            ? [irc.broadcasts[ircChannel]]
            : irc.broadcasts[ircChannel];
          discordChannels.forEach((discordChannelId) => {
            const ch = Guild.channels
              .find((x) => String(x.id) === String(discordChannelId));
            if (ch) {
              // Discord channel exists. Save the channel for broadcasting.
              if (ircBroadcasts[ircChannel]) {
                ircBroadcasts[ircChannel].push(ch);
              } else {
                ircBroadcasts[ircChannel] = [ch];
              }
            }
          });
        });
      }
      // Process valid discord broadcasts.
      if (discord && typeof discord.broadcasts === 'object') {
        Object.keys(discord.broadcasts).forEach((discordChannelId) => {
          if (
            Guild.channels
              .find((x) => String(x.id) === String(discordChannelId))
          ) {
            // Discord channel exists.
            // Validate irc channels.
            const ircChannels = typeof discord.broadcasts[discordChannelId] === 'string'
              ? [discord.broadcasts[discordChannelId]]
              : discord.broadcasts[discordChannelId];
            ircChannels.forEach((ircChannel) => {
              if (
                typeof ircChannel === 'string' &&
                ircChannel.length >= 2 &&
                ircChannel.charAt(0) === '#'
              ) {
                if (discordBroadcasts[String(discordChannelId)]) {
                  discordBroadcasts[String(discordChannelId)].push(ircChannel);
                } else {
                  discordBroadcasts[String(discordChannelId)] = [ircChannel];
                }
              }
            });
          }
        });
      }
      // If nothing to broadcast, don't broadcast.
      if (
        !Object.keys(ircBroadcasts).length &&
        !Object.keys(discordBroadcasts).length
      ) return false;
      // Collect settings.
      const {server, port, nickname, password} = irc;
      if (typeof server !== 'string' || typeof port !== 'number' || typeof nickname !== 'string') {
        print('Missing mandatory irc settings. See the documentation for a proper configuration.',
          name, true, e);
        return false;
      };
      // Initialize the connection.
      ircClient = new NodeIrc(server, port, nickname, 'Tunneler.js', password);
      ircClient.on('ready', module.onReady);
      ircClient.on('CHANMSG', module.onCHANMSG);
      // ircClient.connect();
      return true;
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return false;
  };

  return module;
};
