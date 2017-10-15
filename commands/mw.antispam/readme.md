# mw.antispam

Punishes users of spamming.

## Guild Settings
### "punishment"
A punishment or a list of punishments that will happen in the given order. The available punishments are: "warn", "role", "kick" and "ban". With empty strings you can have the bot to ignore violations.

After the punishment or list of punishments is done, a new round will begin for the user. E.g. if the punishment is just "warn", the bot will always warn the user about the new violations.

Example 1: "punishment": "kick"

Example 2: "punishment": ["warn", "warn", "kick", "ban"]

Example 3: "punishment": ["", "warn", "kick"]

### "punishmentRole"
An id of a Discord role used with the punishment "role". The punishment type "role" does not work without this id.

Example 1: "punishmentRole": "363004559863316484"

### "cyclePunishments"
Whether to start a new round after the list of punishments is done for the user. If set to false, every punishment is given to the user only once. Setting this to false for the "role" punishment is not required. An user with a punishment role won't be re-assigned to the role.

Example 1: "cyclePunishments": true

### "silentMode"
Whether to publicly inform that an action was made. E.g. "User was banned because of spamming.". If enabled, this middleware will never say anything.

Example 1: "silentMode": false

## How to ignore some users?
Tunneler.js supports exclusion of channels, authors and roles. The following examples work with all middlewares and commands.

Example 1: excludedChannels: ["106724912392193792", "112324985292193321"]

Example 2: excludedAuthors: ["106723213511237123"]

Example 3: excludedRoles: ["106721232118044928"]

## Antispam is too aggressive
The way antispam recognizes spam patterns has no easy way to weaken the analysis. You could rethink your punishments e.g. by ignoring first violations. You can also exclude channels, authors and roles.

However, if you still would want to tweak the analysis, see the mw.antispam/middleware.json file, section "globalSettings". Here you can alter some of the inner limits that the module uses for detecting spam.

## Antispam doesn't recognize some spam variant.
If you encounter spam that is not recognized by this module, please create a new issue to Tunneler.js's GitHub project. Remember to provide a clear message log example about the spam.