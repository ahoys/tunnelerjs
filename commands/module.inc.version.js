const Strings = require('../config/strings.json');
module.exports = () => {

    const module = {};

    /**
     * Executes a version message.
     * @param messageObject
     */
    module.execute = (messageObject) => {
        messageObject.reply(Strings.commands.version.success_0);
    };

    return module;
};