const Strings = require('../config/strings.json');
module.exports = () => {

    const module = {};

    /**
     * Executes a mention message.
     * @param messageObject
     */
    module.execute = (messageObject) => {
        messageObject.channel.send(Strings.mention.success_0[Math.floor(Math.random() *
            Strings.mention.success_0.length)]);
    };

    return module;
};