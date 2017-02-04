const Strings = require('./config/strings.json');
module.exports = (client) => {

    const module = {};

    /**
     * A plain default message with no special meaning.
     * Often the default response will be given if the command is not recognized.
     * @param Message
     * @returns {*}
     */
    module.defaultResponse = (Message) => {
        Message.channel.send(Strings.defaultResponse.success_0[Math.floor(Math.random() *
            Strings.defaultResponse.success_0.length)]);
    };

    /**
     * Information about the bot.
     * @param Message
     */
    module.about = (Message) => {
        Message.channel.send(Strings.about.success_0);
    };

    /**
     * A simple ping pong command.
     * @param Message
     */
    module.ping = (Message) => {
        Message.reply(`${Strings.ping.success_0}${Math.round(client.ping)}${Strings.ping.success_1}`);
    };

    /**
     * Selects random users from a guild and prints them.
     * @param Message
     * @param container
     * @returns {boolean}
     */
    module.selectFromClients = (Message, container) => {
        if (!isNaN(container.str) && container.str > 0) {
            const memberArr = Message.guild.members.map((member) => {return member.displayName});
            let i = 0;
            let members = '';
            module.shuffle(memberArr).forEach((displayName) => {
                if (i < Number(container.str) && displayName !== undefined) {
                    members += i > 0 ? `, ${displayName}` : displayName;
                    i++;
                }
            });
            if (i > 0) {
                // Success!
                members = i === 1 ? members.replace(',', '') : members;
                const msg = `${Strings.selectFromClients.success_0}` +
                    `${Strings.selectFromClients.name_strings[Math.floor(Math.random() 
                        * Strings.selectFromClients.name_strings.length)]}` +
                    `${Strings.selectFromClients.success_1} `;
                Message.channel.send(`${msg}${members}.`);
                return true;
            } else {
                // Print failed attempt (guild is empty).
                Message.channel.send(Strings.selectFromClients.fail_2);
            }
        } else if (container.str === '0') {
            // Print failed attempt (trying to pick from zero).
            Message.reply(Strings.selectFromClients.fail_1);
        } else {
            // Print failed attempt (invalid command).
            Message.reply(Strings.selectFromClients.fail_0);
        }
        return false;
    };

    /**
     * Shuffles an array.
     * @param array
     * @returns {*}
     */
    module.shuffle = (array) => {
        if (array.constructor === Array) {
            let temp, current, top = array.length;
            if (top) while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                temp = array[current];
                array[current] = array[top];
                array[top] = temp;
            }
            return array;
        }
        return [];
    };

    return module;
};