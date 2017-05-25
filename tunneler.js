const cluster = require('cluster');
const {print, log} = require('./util/module.inc.debug')();

// Initialize console.log file.
log('A new process started.', 'MAIN');

// Initialize the main thread.
if (cluster.isMaster) {
    cluster.fork();
    print('Hello world!', 'Main', false);

    cluster.on('exit', (worker, code, signal) => {
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
            log(`Terminated master thread.`, 'Main');
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
    require('./handles')(AuthMap, GuildsMap);
}
