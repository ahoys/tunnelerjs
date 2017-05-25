const cluster = require('cluster');
const {print, log} = require('./util/module.inc.debug')();

/**
 * Adds a new worker thread.
 */
const addThread = () => {
    try {
        const worker = cluster.fork();
        worker.on('exit', (code, signal) => {
            // Log the reason why the worker died.
            log(`Thread ${worker.id} closed (${code || signal}).`, 'Main');
        });
        return worker;
    } catch (e) {
        log('Adding a thread failed.', 'Main', e);
    }
    return {};
}

// Initialize the main thread.
if (cluster.isMaster) {
    log('==== A new process started ====', 'MAIN');
    print('Hello world!', 'Main', false);

    // A short delay before starting the
    // worker process.
    let worker = addThread();

    cluster.on('exit', (worker, code, signal) => {
        if (code === 1) {
            // Unexpected shut down.
            print('The process was closed unexpectedly. '
                + 'Restarting in 5 seconds...', 'Main', true,
                `pid: ${worker.process.pid}, code: ${code}.`);
            // Make sure the worker is dead.
            if (!worker.isDead) worker.kill();
            setTimeout(() => {
                // Restart.
                worker = addThread();
            }, 5120);
        } else if (code === 2) {
            // User triggered shut down.
            print('The process was asked to exit. '
                + 'Shutting down...', 'Main', true,
                `pid: ${worker.process.pid}, code: ${code}.`);
            // Make sure the worker is dead.
            if (!worker.isDead) worker.kill();
            setTimeout(() => {
                process.exit(0);
            }, 512);
        } else {
            log(`Application was forced to close (${code || signal}).`, 'Main');
            // Make sure the worker is dead.
            if (!worker.isDead) worker.kill();
        }
    });

    // Ctrl+C event.
    process.on('SIGINT', () => {
        log('The process was shut down.', 'Main');
        print('Shutting down...', 'Main', false);
        // You must exit to switch the exit flag.
        // Otherwise the app may end up into a restarting loop.
        setTimeout(() => {
            process.exit(0);
        }, 1024);
    });
}

// Initialize the working thread.
if (cluster.isWorker) {

    // Log the worker.
    log(`Thread ${cluster.worker.id} started.`, 'Main');

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
        log('uncaughtException occurred.', 'Main', err);
    } catch(e) {
        // Logging failed, just print the event.
        console.log(e);
    }
    process.exit(1);
});
