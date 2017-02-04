const Strings = require('./strings.json');
module.exports = (client) => {

    const module = {};

    /**
     * A plain default message with no special meaning.
     * Often the default response will be given if the command is not recognized.
     * @param Message
     * @returns {*}
     */
    module.defaultResponse = (Message) => {
        Message.channel.send(Strings.bot_mention[Math.floor(Math.random() * Strings.bot_mention.length)]);
    };

    /**
     * Information about the bot.
     * @param Message
     */
    module.about = (Message) => {
        Message.channel.send(Strings.bot_about);
    };

    /**
     * A simple ping pong command.
     * @param Message
     */
    module.ping = (Message) => {
        Message.reply(`pong in ${client.ping} ms. `);
    };

    return module;
};