const {print} = require('../../util/module.inc.debug')();

/**
 * Replies with a taunt.
 *
 * Author: Ari Höysniemi
 * Date: May 25. 2017
 * @param {object} Settings
 * @param {object} Strings
 * @param {string} name
 * @return {object}
 */
module.exports = (Settings, Strings, name) => {
    const module = {};

    const getRandomTaunt = () => {
        return Strings.taunts[Math.floor(Math.random() *
            Strings.taunts.length)];
    }

    /**
     * Executes the command.
     * @param {object} Message
     * @param {object} Client
     * @return {string}
     */
    module.execute = (Message, Client) => {
        try {
            return getRandomTaunt();
        } catch (e) {
            print(`Command execution failed.`, name, true, e);
        }
        return '';
    };

    return module;
};
