module.exports = (Client) => {
    const modules = {};

    modules.execute = () => {
        Debug.print('Disconnected.', 'MAIN');
        process.exit(0);
    };

    return modules;
};
