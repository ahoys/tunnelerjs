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
