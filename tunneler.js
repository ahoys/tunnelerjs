const cluster = require('cluster');
const {print, log} = require('./util/module.inc.debug')();

const addThread = () => {
    try {
        const worker = cluster.fork();
        worker.on('exit', () => {
            log(`Thread ${worker.id} closed.`, 'Main');
        });
        return worker;
    } catch (e) {
        log('Could not add a new thread.', 'Main', e);
        process.exit(1);
    }
    return {};
};

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
            worker.kill();
            setTimeout(() => {
                // Restart.
                worker = addThread();
            }, 5120);
        }
        if (code === 2) {
            // User triggered shut down.
            print('The process was asked to exit. '
                + 'Shutting down...', 'Main', true,
                `pid: ${worker.process.pid}, code: ${code}.`);
            worker.kill();
            setTimeout(() => {
                process.exit(0);
            }, 512);
        }
    });

    // Ctrl+C event.
    process.on('SIGINT', () => {
        console.log('Shutting down...');
        worker.kill();
        setTimeout(() => {
            process.exit(0);
        }, 512);
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
        // Logging filed, just print the event.
        console.log(e);
    }
    process.exit(1);
});
