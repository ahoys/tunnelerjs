const {print, log} = require('../../util/module.inc.debug')();

module.exports = (Settings, Strings, name) => {
  const module = {};

  /**
   * Returns true if the Message author
   * can be investigated.
   * 
   * Admin can define users that have roles
   * to not be investigated.
   */
  canBeInvestigated = (Member) => {
    try {
      const { roles } = Member;
      return typeof roles === 'object'
        && roles.constructor === Array
        && roles.length <= 0;
    } catch (e) {
      print('canBeInvestigated failed.', name, true, e);
    }
  }

  /**
   * Punish the Message author.
   */
  doPunish = (Message, punishment = 'role', punishmentRole = '', silent = true) => {
    const {member, author, channel, guild} = Message;
    try {
      switch(punishment) {
        case 'ban':
          if (member.bannable) {
            member.ban({days: 1, reason: 'Posted not allowed content.'})
              .then(() => {
                print(`Banned "${author.username}".`, name, true);
                if (!silent) channel.send(`${author.username} ${Strings['badcontent_ban']}`);
              })
              .catch((e) => {
                print('Banning failed.', name, true, e);
              });
          }
          break;
        case 'kick':
          if (member.kickable) {
            member.kick({days: 1, reason: 'Posted not allowed content.'})
            .then(() => {
              print(`Kicked "${author.username}".`, name, true);
              if (!silent) channel.send(`${author.username} ${Strings['badcontent_kick']}`);
            })
            .catch((e) => {
              print('Kicking failed.', name, true, e);
            });
          }
          break;
        case 'role':
          const roleObj = guild.roles.get(punishmentRole);
          if (roleObj) {
            member.addRole(roleObj, 'Posted not allowed content.')
            .then(() => {
              print(`Set role "${roleObj.name}" to "${author.username}".`, name, true);
              if (!silent) channel.send(`${author.username} ${Strings['badcontent_role']}`);
            }).catch((e) => {
              print(`Adding a punishment role (${punishmentRole}) failed.`, name, true, e);
            });
          }
          break;
        case 'warn':
          console.log(Strings);
          Message.reply(Strings['badcontent_warn']);
          break;
      }
    } catch (e) {
      print('doPunish failed.', name, true, e);
    }
  }

  module.execute = (Message, Client, guildSettings) => {
    try {
      const { illegalContent, punishment, punishmentRole, silent } = guildSettings;
      const Member = Message.member;
      if (
        Member
        && illegalContent
        && illegalContent[0]
        && (!guildSettings.onlyNoRoles || canBeInvestigated(Member))
      ) {
        const content = Message.content; // The actual plain-text message.
        const str = typeof content === 'string' ? content.toLowerCase() : '';
        const foundings = illegalContent.filter(c => str.includes(c.toLowerCase()));
        if (foundings[0]) {
          // We have found illegal content.
          doPunish(Message, punishment, punishmentRole, silent);
        }
      }
    } catch (e) {
      print(`Could not execute a middleware (${name}).`, name, true, e);
    }
    return '';
  };

  return module;
};
