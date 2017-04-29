module.exports = (Debug, Strings, Client) => {
    const module = {};

    // Command strings
    const stringsJSON = Strings.get(['commands', 'ping']);

    /**
     * Returns a client ping.
     * @returns {number}
     */
    const getPing = () => {
        return Math.round(Client.ping);
    };

    /**
     * Executes this command.
     * @returns {boolean}
     */
    module.execute = (payload) => {
        try {
            const { Message } = payload;
            if (Message) {
                const ping = getPing();
                Message.reply(`${stringsJSON['success_0']}${ping}${stringsJSON['success_1']}`);
                return true;
            }
            return false;
        } catch (e) {
            Debug.print('Executing ping failed.', 'PING ERROR', true, e);
            return false;
        }
    };

    return module;
}
