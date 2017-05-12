// Utilities
const Debug = require('./util/module.inc.debug')();
const Parser = require('./util/module.inc.parser')(Debug);

// Authentication data
// Includes token, id and owner.
const Auth = require('./auth')(Debug);
const AuthMap = Auth.initialize();

// Commands data
// All the available commands mapped into a special object frames.
const Commands = require('./commands')(Debug);
const CommandsMap = Commands.initialize();

// Guilds data
// Each guild can have its own commands, settings and translations.
const Guilds = require('./guilds')(Debug, CommandsMap);
const GuildsMap = Guilds.initialize();

// Discord.js API and handles.
require('./handles')(Debug, AuthMap, Parser, GuildsMap);
