const {print} = require('../../../util/module.inc.debug')();

module.exports = () => {
    const module = {};

    /**
     * Warns an author with a reply.
     */
    module.warn = (Message) => {
        try {
            Message.reply('You have been warned.');
        } catch (e) {
            print(`Could not warn (${Message.GuildMember.displayName}).`,
                'antispam/punish', true, e);
        }
    }

    /**
     * Gives a role to an author.
     */
    module.role = (GuildMember, roleId) => {
        try {
            GuildMember.addRole(roleId);
        } catch (e) {
            print(`Could not role (${GuildMember.displayName}).`,
                'antispam/punish', true, e);
        }
    }

    /**
     * Kicks an author.
     */
    module.kick = (GuildMember, days) => {
        try {
            GuildMember.kick(days || 0);
        } catch (e) {
            print(`Could not kick (${GuildMember.displayName}).`,
                'antispam/punish', true, e);
        }
    }

    /**
     * Bans an author.
     */
    module.ban = (GuildMember, days) => {
        try {
            GuildMember.ban(days || 0);
        } catch (e) {
            print(`Could not ban (${GuildMember.displayName}).`,
                'antispam/punish', true, e);
        }
    }

    return module;
}
