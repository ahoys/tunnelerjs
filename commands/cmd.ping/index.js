/**
 * Replies with a client ping.
 * 
 * Author: Ari Höysniemi
 * Date: May 6. 2017
 */
module.exports = (Debug, Settings, Strings, name) => {
    const module = {};

    /**
     * Returns a client ping.
     * @returns {number}
     */
    const getPing = (Client) => {
        return Math.round(Client.ping);
    };

    /**
     * Executes the command.
     * @param {object} Message : Discord.js Message object.
     * @returns {boolean}
     */
    module.execute = (Message, Client) => {
        try {
            const ping = getPing(Client);
            Message.reply(`${Strings['success_0']}${ping}${Strings['success_1']}`);
            return true;
        } catch (e) {
            Debug.print(`Executing a command (${name}) failed.`, `${name} ERROR`, true, e);
            return false;
        }
    }

    return module;
}
