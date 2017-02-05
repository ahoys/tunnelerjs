const Strings = require('../config/strings.json');
module.exports = () => {

    const module = {};

    module.execute = (messageObject) => {
        messageObject.channel.send(Strings.about.success_0);
    };

    return module;
};