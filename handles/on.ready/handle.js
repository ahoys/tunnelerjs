const {print} = require('../../util/module.inc.debug')();
const fs = require('fs');

/**
 * Ready handle.
 * @param {object} Client
 * @param {object} GuildsMap
 * @return {object}
 */
module.exports = (Client, GuildsMap) => {
    const module = {};

    /**
     * Creates new guild files.
     * @param {string} guildId
     * @return {boolean}
     */
    const createGuildFiles = (guildId) => {
        try {
            const path = `./guilds/${String(guildId.substr(0, 128))}`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
                const template = '' +
                '{\n' +
                '    "localization": "en",\n' +
                '    "middlewares": {\n' +
                '      "antispam": {\n' +
                '        "enabled": true\n' +
                '      }\n' +
                '    },\n' +
                '    "commands": {\n' +
                '      "exit": {\n' +
                '        "enabled": true,\n' +
                '        "access": ["owner"]\n' +
                '      }\n' +
                '    }\n' +
                '}\n';
                fs.writeFileSync(`${path}/guild.json`, template);
                return true;
            }
            return false;
        } catch (e) {
            print(`Creating guild files failed for (${guildId}). `
            + `The process will now exit.`,
            'MAIN ERROR', true, e);
            process.exit(1);
            return false;
        }
    };

    /**
     * Executes the handle.
     */
    module.handle = () => {
        const {user, guilds} = Client;
        let shutDown = false;
        guilds.forEach((guild) => {
            if (!GuildsMap[guild.id]) {
                print(`Could not find configuration for a guild `
                + `(${guild.id}). Generating files...`, 'MAIN');
                if (createGuildFiles(guild.id)) {
                    // Success.
                    shutDown = true;
                } else {
                    // Fail.
                    print('Could not create files. Create the files manually.',
                    'MAIN WARN');
                }
            }
        });
        if (shutDown) {
            // The application is oredered to be shut down.
            // This happens if there are new guilds generated.
            print(`New guild files added (./guilds/${guild.id}). Make sure `
            + `they are configured properly before restarting .`, 'MAIN');
            print('The process will now exit', 'MAIN', true,
            'User must validate the new files.');
            process.exit(0);
        }
        print(`Serving ${guilds.array().length} server(s).`, 'MAIN');
        print(`Logged in as ${user.username}.`, 'MAIN');
        print(`Initialization ready, monitoring activity...`, 'MAIN');
    };

    return module;
};
