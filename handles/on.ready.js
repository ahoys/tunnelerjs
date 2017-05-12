module.exports = (Client, Debug, GuildsMap) => {
    const modules = {};

    modules.execute = () => {
        const {user, guilds} = Client;
        guilds.forEach((Guild) => {
            if (!GuildsMap[Guild.id]) {
                Debug.print(
                    `Could not find configuration for a guild (${Guild.id}).`,
                    'MAIN'
                    );
            }
        });
        Debug.print(`Serving ${guilds.array().length} server(s).`, 'MAIN');
        Debug.print(`Logged in as ${user.username}.\n
        Initialization ready, monitoring activity...\n`, 'MAIN');
    };

    return modules;
};
