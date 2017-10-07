const cluster = require('cluster');
const { print, log } = require('./util/module.inc.debug')();

// If the application is offline, it won't reach the handlers.
// No connections to Discord are made.
const isOffline = process.argv.indexOf('OFFLINE') !== -1;

if (cluster.isMaster) {
  // -- Master Thread --
  let crashStamps = [];
  cluster.fork();
  cluster.on('exit', (worker, code, signal) => {
    // Usually only the code is used.
    const flag = code === undefined ? signal : code;
    if (flag === 1) {
      // Unexpected exit.
      // Eg. crash caused by an error.
      // Attempt to recover by restarting the worker.
      print('The process encountered an error and crashed.', 'Main',
        true, `pid: (${worker.process.pid}), code: (${code}), `
        + `signal: (${signal})`);
      const len = crashStamps.length;
      crashStamps.push(new Date().getTime());
      if (len === 0 || (crashStamps[len] - crashStamps[len - 1] > 6144)) {
        // Over one second passed since the last crash. Meaning the
        // app probably isn't in a loop of death.
        // Reboot.
        print('Rebooting in 1 second...', 'Main');
        setTimeout(() => {
          cluster.fork();
        }, 1024);
        // Empty the buffer now and then.
        if (len > 32) crashStamps = [];
      } else {
        // Circle of death.
        print('Could not reboot because of instant crashing.', 'Main');
        log(`Crash timestamps: (${crashStamps}) (max 32 shown).`,
          'Main');
      }
    } else if (flag === 2) {
      // Controlled exit.
      // Eg. close command.
      // Gracefully close the application.
      print('The process was ordered to exit.', 'Main');
    } else if (flag === 3) {
      // Controlled reboot.
      print('The process was ordered to reboot.', 'Main');
      print('Rebooting in 5 seconds...', 'Main');
      setTimeout(() => {
        cluster.fork();
      }, 5120);
    } else {
      // Unknown exit.
      // Document the crash.
      log('The process was closed.', 'Main',
        `pid: (${worker.process.pid}), code: (${code}), `
        + `signal: (${signal})`);
    }
  });

  // Ctrl+c event.
  process.on('SIGINT', () => {
    print('Shutting down...', 'Main', false);
    // You must exit to switch the exit flag.
    // Otherwise the app may end up into a restarting loop.
    setTimeout(() => {
      process.exit(0);
    }, 1024);
  });

  // Something unexpected.
  // This shouldn't be happening.
  process.on('uncaughtException', (err) => {
    try {
      // Attempt to log the event.
      log('UncaughtException occurred.', 'Main', err);
    } catch (e) {
      // Logging failed, just print the event.
      console.log(e);
    }
    process.exit(1);
  });
} else {
  // -- Worker Thread --
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
  if (!isOffline) {
    require('./handles')(AuthMap, GuildsMap);
  }
}
