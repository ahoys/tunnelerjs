const { log, print } = require('../../util/module.inc.debug')();
const Parser = require('../../util/module.inc.parser')();

/**
 * Message handle.
 * @param {object} Client
 * @param {object} GuildsMap
 * @param {string} ownerId
 * @return {object}
 */
module.exports = (Client, GuildsMap, ownerId) => {
  const module = {};

  /**
   * Returns whether the given author has an access
   * to the command or middleware.
   * @param {array} accesses 
   * @param {string} authorId 
   * @return {boolean}
   */
  const hasAccess = (accesses, authorId) => {
    try {
      // No access.
      if (
        typeof accesses !== 'object' ||
        accesses.constructor !== Array ||
        !accesses.length
      ) return false;
      // All access.
      if (accesses.indexOf('all') !== -1) return true;
      // Owner access.
      if (
        accesses.indexOf('owner') !== -1 &&
        authorId === ownerId
      ) return true;
      // Author id access.
      if (accesses.indexOf(authorId) !== -1) return true;
    } catch (e) {
      print('Verifying access failed.', 'Handler', true, e);
    }
    return false;
  };

  /**
   * Returns an action object.
   * @param {object} Message
   * @return {object}
   */
  module.getAction = (Message) => {
    // This action object will be returned.
    const action = {
      key: '',
      module: undefined,
      params: [],
      isMiddleware: false,
      isPrivate: !Message.guild,
    };
    // Contents of the message in an array.
    // Length (len) of the array.
    const contents = Message.content
      ? Message.content.trim().split(' ')
      : [];
    const len = contents.length;
    // GuildModule contains the guild's
    // access settings and available commands.
    // All commands are bound to a guild!
    const GuildModule = Message.guild
      ? GuildsMap[Message.guild.id]
      : len >= 2
        ? GuildsMap[contents[0]]
        : undefined;
    // The bot must always be mentioned if a guild channel.
    // No mentions are required for a private message, but
    // then the message must contain the guild id.
    const isMentioned = Message.guild
      ? Message.isMentioned(Client.user)
      : len >= 2
        ? Object.keys(GuildsMap).indexOf(contents[0]) !== -1
        : false;
    // If a valid guild is found and the bot is properly mentioned,
    // we then try to find out what command the user wants to
    // initialize.
    // The command must be the second word (the first one being guild id
    // or the bot mention).
    if (GuildModule && isMentioned) {
      if (
        GuildModule.middlewares[contents[1]] &&
        GuildModule.middlewares[contents[1]].control &&
        hasAccess(GuildModule.middlewares[contents[1]].access, Message.author.id) &&
        len >= 3
      ) {
        // Middleware command found.
        // Because middlewares aren't direct commands, the message
        // must contain parameters.
        // The middleware decides what to do with these parameters.
        action.key = contents[1];
        action.module = GuildModule.middlewares[contents[1]];
        action.isMiddleware = true;
        action.params = contents.splice(2, 32);
      } else if (
        GuildModule.commands[contents[1]] &&
        GuildModule.commands[contents[1]].execute &&
        hasAccess(GuildModule.commands[contents[1]].access, Message.author.id)
      ) {
        // Command found.
        action.key = contents[1];
        action.module = GuildModule.commands[contents[1]];
        action.params = contents.splice(2, 32);
      }
    }
    // Only a valid action will be returned.
    return action.module
      ? action
      : undefined;
  };

  /**
   * Executes middlewares for the handle.
   * Is able to block the execution is necessary.
   * @param {object} Message
   * @return {boolean}
   */
  module.prepare = (Message) => {
    let pass = true;
    // Normal middleware preparation.
    // Middleware works only on guild channels.
    const GuildModule = Message.guild
      ? GuildsMap[Message.guild.id]
      : undefined;
    // If no guild or middlewares, no reason to continue.
    if (
      !GuildModule ||
      typeof GuildModule.middlewares !== 'object'
    ) return true;
    // Execute all middlewares, if any.
    Object.keys(GuildModule.middlewares).forEach((mwKey) => {
      const {
        execute,
        enabledChannels,
        excludedChannels,
        enabledAuthors,
        excludedAuthors,
        enabledRoles,
        excludedRoles,
        guildSettings,
      } = GuildModule.middlewares[mwKey];
      // Make sure the channel is included to be middlewared.
      // Also make sure the author or the role are not excluded.
      if (
        Parser.isIncluded(Message.channel.name, enabledChannels,
          excludedChannels, true) &&
        Parser.isIncluded(Message.author.id, enabledAuthors,
          excludedAuthors, true) &&
        Parser.isIncluded(Message.member.roles, enabledRoles,
          excludedRoles, true)
      ) {
        // Look for a halting reason.
        const haltReason = execute(Message, Client, guildSettings);
        if (typeof haltReason !== 'string' || haltReason.length) {
          // An invalid return or an error message.
          const errMsg = typeof haltReason === 'string'
            ? haltReason
            : 'Unknown reason (invalid return type)';
          log(`Middleware "${mwKey}" halted the processing.`, 'Handler', errMsg);
          pass = false;
        }
      }
    });
    // Whether to let the process continue (true/false).
    return pass;
  };

  /**
   * Handles command execution.
   * @param {object} Message
   * @param {object} action
   */
  module.handle = (Message, action) => {
    // Before executing, make sure the guild settings
    // allow this execution.
    if (
      // Channels.
      (
        action.isPrivate ||
        Parser.isIncluded(
          Message.channel.name,
          action.module.enabledChannels,
          action.module.excludedChannels,
          true
        )
      ) &&
      // Authors.
      Parser.isIncluded(
        Message.author.id,
        action.module.enabledAuthors,
        action.module.excludedAuthors,
        true
      ) &&
      // Roles.
      (
        action.isPrivate ||
        Parser.isIncluded(
          Message.member.roles,
          action.module.enabledRoles,
          action.module.excludedRoles,
          true
        )
      )
    ) {
      // Measure the performance while executing.
      const perfMeasure = process.hrtime();
      // It is up to the command author to handle the message displaying.
      // Commands are executed externaly and they shouldn't affect the bot.
      action.module.execute(Message, Client);
      log(
        `A triggered command "${action.key}" took `
        + `${process.hrtime(perfMeasure)[1] / 1000000}ms to execute. `
        + `Execution was made by "${Message.author.username}".`,
        'Handler'
      );
    }
  };

  return module;
};
