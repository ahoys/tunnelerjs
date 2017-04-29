module.exports = (Debug, Strings, Client) => {
    const module = {};
    const str_success_0 = Strings.get(['commands', 'ping', 'success_0']);
    const str_success_1 = Strings.get(['commands', 'ping', 'success_1']);

    /**
     * Returns a client ping.
     */
    const getPing = () => {
        return Math.round(Client.ping);
    };

    /**
     * Executes this command.
     */
    module.execute = (payload) => {
        try {
            const { messageObject } = payload;
            if (messageObject) {
                const ping = getPing();
                messageObject.reply(`${str_success_0}${ping}${str_success_1}`);
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
