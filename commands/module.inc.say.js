const _ = require('lodash');
const Strings = require('../config/strings.json');
module.exports = (client) => {

    const module = {};

    /**
     * Executes say string.
     * @param messageObject
     * @param str
     */
    module.execute = (messageObject, str) => {
        if (str !== undefined && messageObject.guild === null) {
            if (!isNaN(str[1])) {
                const allGuilds = client.guilds;
                const selectedGuild = allGuilds.filter((guild) => { return guild.id === str[1] }).first();
                if (selectedGuild !== undefined) {
                    const channel = selectedGuild.channels.filter((channel) => { return channel.id === str[1]}).first();
                    if (channel.type === 'text') {
                        // Form the message.
                        let msg = '';
                        str.forEach((word, i) => {
                            msg += i > 1 ? `${str[i]} ` : '';
                            if (i === str.length) {
                                msg += '.';
                            }
                        });
                        msg = msg.charAt(0).toUpperCase() + msg.slice(1);
                        // Send the message.
                        channel.sendMessage(msg)
                            .then(message => console.log(`Sent message: ${message.content}`))
                            .catch(console.error);
                    }
                    messageObject.reply(Strings.commands.say.success_0);
                } else {
                    // Channel was not found.
                    messageObject.reply(Strings.commands.say.fail_3);
                }
            } else {
                // Channel not provided.
                messageObject.reply(Strings.commands.say.fail_2);
            }
        } else if (str === undefined && messageObject.guild === null) {
            // Invalid message.
            messageObject.reply(Strings.commands.say.fail_0);
        } else {
            // Message given on server instead of private.
            messageObject.reply(Strings.commands.say.fail_1);
        }
    };

    return module;
};