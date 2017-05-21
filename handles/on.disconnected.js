const {print} = require('../util/module.inc.debug')();
module.exports = (Client) => {
    const modules = {};

    modules.execute = () => {
        print('Disconnected.', 'MAIN');
        process.exit(0);
    };

    return modules;
};
