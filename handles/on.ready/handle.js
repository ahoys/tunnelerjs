const {print} = require('../../util/module.inc.debug')();
const File = require('../../util/module.inc.file')();
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
     */
    const checkGuildFiles = (guildId) => {
        try {
            const path = `./guilds/${String(guildId.substr(0, 128))}`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
                if (fs.existsSync('./guilds/template.json')) {
                    // Create a new guild.json file based on a template.
                    File.copyFile('./guilds/template.json',
                    `${path}/guild.json`, ((e) => {
                        if (e) {
                            print(`Failed to create (${path}/guild.json).`
                            + `Create a proper guild file manually. `
                            + `The process will now exit.`, true, e);
                            process.exit(1);
                        };
                        print(`New guild file(s) added (${path}/guild.json).`,
                        'MAIN');
                        print('Make sure the file(s) are configured properly '
                        + 'before restarting.', 'MAIN');
                        print('The process will now exit.', 'MAIN', true,
                        'User must validate the new files.');
                        process.exit(0);
                    }));
                } else {
                    // Missing the template file.
                    print('Missing a valid ./guilds/template.json file. '
                    + 'The process will now exit.', 'MAIN ERROR');
                    process.exit(1);
                }
            }
        } catch (e) {
            print(`Creating guild files failed for (${guildId}). `
            + `The process will now exit.`,
            'MAIN ERROR', true, e);
            process.exit(1);
        }
    };

    /**
     * Executes the handle.
     */
    module.handle = () => {
        const {user, guilds} = Client;
        guilds.forEach((guild) => {
            if (!GuildsMap[guild.id]) {
                print(`Could not find configuration for a guild `
                + `(${guild.id}). Generating files...`, 'MAIN');
                checkGuildFiles(guild.id);
            }
        });
        print(`Serving ${guilds.array().length} server(s).`, 'MAIN');
        print(`Logged in as ${user.username}.`, 'MAIN');
        print(`Initialization ready, monitoring activity...`, 'MAIN');
    };

    return module;
};
