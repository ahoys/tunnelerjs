const Strings = require('../config/strings.json');
module.exports = () => {

    const module = {};

    /**
     * Shuffles and array.
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

    /**
     * Executes a selection command.
     * @param messageObject
     * @param count
     */
    module.execute = (messageObject, count) => {
        count = count[1];
        if (
            count !== undefined &&
            messageObject.guild !== null &&
            !isNaN(count) &&
            count > 0
        ) {
            const number = Math.round(Number(count));
            const membersArr = messageObject.guild.members.map((member) => {return member.displayName});
            let members = '';
            let i = 0;
            module.shuffle(membersArr).forEach((displayName) => {
                if (i < number && displayName !== undefined) {
                    members += i > 0 ? `, ${displayName}` : displayName;
                    i++;
                }
            });
            if (i > 0) {
                // Remove excess markings if only a one user.
                members = i === 1 ? members.replace(',', '') : members;
                const msg = `${Strings.commands.select.success_0}` +
                    `${Strings.commands.select.name_strings[Math.floor(Math.random()
                        * Strings.commands.select.name_strings.length)]}` +
                    `${Strings.commands.select.success_1} `;
                messageObject.channel.send(`${msg}${members}.`);
            } else {
                // Failed attempt, the guild is empty.
                messageObject.reply(Strings.commands.select.fail_2);
            }
        } else if (count === '0') {
            // Failed attempt, trying to pick from zero.
            messageObject.reply(Strings.commands.select.fail_1);
        } else {
            // Failed attempt, invalid command.
            if (messageObject.guild === null) {
                messageObject.reply(Strings.commands.select.fail_3);
            } else {
                messageObject.reply(Strings.commands.select.fail_0);
            }
        }
    };

    return module;
};