const {print} = require('../util/module.inc.debug')();
module.exports = (Client, GuildsMap) => {
    const modules = {};

    modules.execute = () => {
        const {user, guilds} = Client;
        guilds.forEach((Guild) => {
            if (!GuildsMap[Guild.id]) {
                print(
                    `Could not find configuration for a guild (${Guild.id}).`,
                    'MAIN'
                    );
            }
        });
        print(`Serving ${guilds.array().length} server(s).`, 'MAIN');
        print(`Logged in as ${user.username}.\n
        Initialization ready, monitoring activity...\n`, 'MAIN');
    };

    return modules;
};
