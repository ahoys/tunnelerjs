const Strings = require('../config/strings.json');
module.exports = (client) => {

    const module = {};

    /**
     * Executes a ping command.
     * @param messageObject
     */
    module.execute = (messageObject) => {
        messageObject.reply(`${Strings.commands.ping.success_0}${Math.round(client.ping)}${Strings.commands.ping.success_1}`);
    };

    return module;
};