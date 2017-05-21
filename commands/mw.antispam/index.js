const {print, log} = require('../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');

module.exports = (Settings, name) => {
    const module = {};

    module.execute = (Message) => {
        try {
            return '';
        } catch (e) {
            return `Execution of (${name}) failed.\n${e}`;
        }
    };

    return module;
};
