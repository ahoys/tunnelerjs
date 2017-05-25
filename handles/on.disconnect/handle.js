const {print} = require('../../util/module.inc.debug')();

/**
 * Disconnection handle.
 * @return {object}
 */
module.exports = () => {
    const module = {};

    /**
     * Executes the handle.
     * @param {object} CloseEvent
     */
    module.handle = (CloseEvent) => {
        print(`Client disconnected (${CloseEvent.code}).`, 'Handler', true,
        CloseEvent.reason);
    };

    return module;
};
