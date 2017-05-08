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
     * @returns {string} : The string that will be used as a reply.
     */
    module.execute = (Message) => {
        try {
            const ping = getPing(Message.client);
            return `${Strings['success_0']}${ping}${Strings['success_1']}`;
        } catch (e) {
            Debug.print(`Executing a command (${name}) failed.`, `${name} ERROR`, true, e);
            return '';
        }
    }

    return module;
}
