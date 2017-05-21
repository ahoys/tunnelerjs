const {print} = require('../../util/module.inc.debug')();

/**
 * Replies with a client ping.
 *
 * Author: Ari Höysniemi
 * Date: May 6. 2017
 * @param {object} Settings
 * @param {object} Strings
 * @param {string} name
 * @return {object}
 */
module.exports = (Settings, Strings, name) => {
    const module = {};

    /**
     * Returns a client ping.
     * @param {object} Client
     * @return {number}
     */
    const getPing = (Client) => {
        return Math.round(Client.ping);
    };

    /**
     * Executes the command.
     * @param {object} Message
     * @param {object} Client
     * @return {string}
     */
    module.execute = (Message, Client) => {
        try {
            const ping = getPing(Client);
            return `${Strings['success_0']}${ping}${Strings['success_1']}`;
        } catch (e) {
            print(
                `Executing a command (${name}) failed.`,
                `${name} ERROR`, true, e
            );
        }
        return '';
    };

    return module;
};
