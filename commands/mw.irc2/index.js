const { print } = require('../../util/module.inc.debug')();

module.exports = (Settings, Strings, name) => {
  const module = {};
  const settings = {};
  const ircBroadcasts = {}; // Irc channels and to where they broadcast.
  const discordBroadcasts = {}; // Discord channels and to where they broadcast.
  const flags = {
    '::p': 'present',
    '::i': 'ignore',
    '::q': 'quit',
  };

  module.onReady = () => {
    try {

    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  }

  module.onCHANMSG = () => {
    try {

    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  }

  module.onPART = () => {
    try {

    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  }

  module.onQUIT = () => {
    try {

    } catch (e) {
      print('onReady failed.', name, true, e);
    }
  }

  module.execute = (Message, guildSettings) => {
    try {

    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  }

  module.initialize = (Guild, guildSettings) => {
    try {
      const { irc, discord } = guildSettings;
      // Process valid irc broadcasts.
      if (irc && typeof irc.broadcasts === 'object') {
        Object.keys(irc.broadcasts).forEach((ircChannel) => {
          const discordChannels = typeof irc.broadcasts[ircChannel] === 'string'
            ? [irc.broadcasts[ircChannel]]
            : irc.broadcasts[ircChannel];
            discordChannels.forEach((discordChannelId) => {
            const ch = Guild.channels.find(x => String(x.id) === String(discordChannelId));
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
          if (Guild.channels.find(x => String(x.id) === String(discordChannelId))) {
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
      // Initialize a connection.
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return false;
  }

  return module;
}
