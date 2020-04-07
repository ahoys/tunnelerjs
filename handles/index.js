const {print} = require('../util/module.inc.debug')();

/**
 * Event handler
 *
 * Handles all the incoming events.
 * @param {object} AuthMap
 * @param {object} GuildsMap
 */
module.exports = (AuthMap, GuildsMap) => {
  const Discord = require('discord.js');
  const Client = new Discord.Client();
  Client.login(AuthMap.token);

  /**
   * Client connected and ready to execute.
   */
  const onReady = require('./on.ready/handle.js')(Client, GuildsMap);
  Client.on('ready', () => {
    try {
      onReady.handle();
    } catch (e) {
      print(
        'Client ready failed. The process will now exit.',
        'Handler', true, e
      );
      process.exit(1);
    }
  });

  /**
   * Client received messages.
   *
   * This handle has a middleware support. Middlewares are
   * executed before the commands.
   */
  const onMessage = require('./on.message/handle.js')(
    Client, GuildsMap, AuthMap.owner);
  Client.on('message', (Message) => {
    try {
      // Make sure it is not the bot talking.
      if (String(Message.author.id) !== String(Client.user.id)) {
        const action = onMessage.getAction(Message);
        if (action && action.isMiddleware) {
          // If a middleware action, don't run the middlewares.
          // This action may be configuring a middleware.
          onMessage.handle(Message, action);
        } else if (action && onMessage.prepare(Message)) {
          // Don't process the action if it does not exist
          // or if a middleware halted the processing (spam).
          onMessage.handle(Message, action);
        } else {
          // Just run the middleware.
          onMessage.prepare(Message);
        }
      }
    } catch (e) {
      print(
        `Processing a message failed.`,
        `Handler`, true, e
      );
    }
  });

  /**
   * Client disconnected.
   */
  const onDisconnect = require('./on.disconnect/handle.js')();
  Client.on('disconnect', (CloseEvent) => {
    try {
      onDisconnect.handle(CloseEvent);
    } catch (e) {
      print(
        'Disconnect failed. The process will now exit.',
        'Handler', true, e
      );
      process.exit(1);
    }
  });

  /**
   * Client reconnecting.
   */
  const onReconnecting = require('./on.reconnecting/handle.js')();
  Client.on('reconnecting', () => {
    try {
      onReconnecting.handle();
    } catch (e) {
      print(
        'Reconnecting failed. The process will now exit.',
        'Handler', true, e
      );
      process.exit(1);
    }
  });
};
