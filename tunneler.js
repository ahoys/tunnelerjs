// Utilities
const Debug = require('./util/module.inc.debug')();
const Parser = require('./util/module.inc.parser')(Debug);

// Authentication data
// Includes token, id and owner.
const AuthMap = require('./auth')(Debug).initialize();

// Commands data
// All the available commands mapped into a special object frames.
const CommandsMap = require('./commands')(Debug).initialize();

// Guilds data
// Each guild can have its own commands, settings and translations.
const GuildsMap = require('./guilds')(Debug, CommandsMap).initialize();

// Discord.js API and handles.
require('./handles')(Debug, AuthMap, Parser, GuildsMap);
