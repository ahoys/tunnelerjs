const {print} = require('../../util/module.inc.debug')();

/**
 * Ready handle.
 * @param {object} Client
 * @param {object} GuildsMap
 * @return {object}
 */
module.exports = (Client, GuildsMap) => {
    const module = {};

    /**
     * Executes the handle.
     */
    module.handle = () => {
        const {user, guilds} = Client;
        guilds.forEach((guild) => {
            if (!GuildsMap[guild.id]) {
                print(`Could not find configuration for a guild `
                + `(${guild.id}).`, 'MAIN');
            }
        });
        print(`Serving ${guilds.array().length} server(s).`, 'MAIN');
        print(`Logged in as ${user.username}.`, 'MAIN');
        print(`Initialization ready, monitoring activity...`, 'MAIN');
    };

    return module;
};
