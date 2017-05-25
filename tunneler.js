const cluster = require('cluster');
const {print, log} = require('./util/module.inc.debug')();

// Initialize the main thread.
if (cluster.isMaster) {
    log('A new process started.', 'MAIN');
    print('Hello world!', 'Main', false);

    // A short delay before starting the
    // worker process.
    setTimeout(() => {
        cluster.fork();
    }, 2048);

    cluster.on('exit', (worker, code, signal) => {
        console.log('exit');
        if (code === 1) {
            // Unexpected shut down.
            print('The process was closed unexpectedly. '
                + 'Restarting in 5 seconds...', 'Main', true,
                `pid: ${worker.process.pid}, code: ${code}.`);
            setTimeout(() => {
                // Restart.
                cluster.fork();
            }, 5120);
        } else {
            // User triggered shut down.
            print('The process was closed. '
                + 'Closing the main thread in 5 seconds...', 'Main', true,
                `pid: ${worker.process.pid}, code: ${code}.`);
            setTimeout(() => {
                process.exit(0);
            }, 5120);
        }
    });

    // Ctrl+C event.
    process.on('SIGINT', () => {
        cluster.disconnect(() => {
            print('Goodbye world!', 'Main', false);
            process.exit(0);
        });
    });
}

// Initialize the working thread.
if (cluster.isWorker) {
    // Authentication data
    // Includes token, id and owner.
    const AuthMap = require('./auth')().initialize();

    // Commands data
    // All the available commands mapped into a special object frames.
    const CommandsMap = require('./commands')().initialize();

    // Guilds data
    // Each guild can have its own commands, settings and translations.
    const GuildsMap = require('./guilds')(CommandsMap).initialize();

    // Discord.js API and handles.
    if (!process.env.OFFLINE) {
        require('./handles')(AuthMap, GuildsMap);
    }
}

// Something unexpected.
process.on('uncaughtException', (err) => {
    log('uncaughtException occurred.', err);
    process.exit(1);
});
