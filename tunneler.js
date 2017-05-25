const cluster = require('cluster');
const {print, log} = require('./util/module.inc.debug')();

// Initialize the main thread.
if (cluster.isMaster) {
    log('==== A new process started ====', 'MAIN');
    print('Hello world!', 'Main', false);

    // A short delay before starting the
    // worker process.
    setTimeout(() => {
        cluster.fork();
    }, 2048);

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
        }
        if (code === 2) {
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
            console.log('Shutting down...')
            setTimeout(() => {
                process.exit(0);
            }, 1024);
        });
    });
}

// Initialize the working thread.
if (cluster.isWorker) {

    // Log the worker.
    log(`Worker ${cluster.worker.id} started.`, 'Main');

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
// This shouldn't be happening.
process.on('uncaughtException', (err) => {
    try {
        // Attempt to log the event.
        log('uncaughtException occurred.', err);
    } catch(e) {
        // Logging filed, just print the event.
        console.log(e);
    }
    process.exit(1);
});
