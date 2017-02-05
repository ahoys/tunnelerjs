const Strings = require('../config/strings.json');
module.exports = () => {

    const module = {};

    /**
     * Executes about string.
     * @param messageObject
     */
    module.execute = (messageObject) => {
        messageObject.channel.send(Strings.about.success_0);
    };

    return module;
};