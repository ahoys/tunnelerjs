const {print, log} = require('../../util/module.inc.debug')();

/**
 * Logs out, terminates the connection to Discord, and destroys the client.
 *
 * Author: Ari Höysniemi
 * Date: May 21. 2017
 * @param {object} Settings
 * @param {object} Strings
 * @param {string} name
 * @return {object}
 */
module.exports = (Settings, Strings, name) => {
    const module = {};

    /**
     * Executes the command.
     * @param {object} Message
     * @param {object} Client
     * @return {string}
     */
    module.execute = (Message, Client) => {
        try {
            const {author} = Message;
            print('Exit command executed. Bye, bye!', name, false);
            log(`Message author (${author.username}, ${author.id}) `
            + `terminated the bot.`);
            Message.reply(`${Strings['success_0']}`);
            setTimeout(() => {
                Client.destroy();
                process.exit(0);
            }, 2048);
        } catch (e) {
            print(`Executing a command (${name}) failed. `
            + `Force shut down...`, name, true, e);
            process.exit(0);
        }
        return '';
    };

    return module;
};
