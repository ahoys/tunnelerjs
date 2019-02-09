# mw.badcontent

Punishes users for posting not allowed words or sentences.
A manual extension to antispam protection.

## Guild Settings
### "punishment"
A punishment that will happen when an user posts not allowed content. The available punishments are: "warn", "role", "kick" and "ban".

There are no levels in badcontent unlike in mw.antispam.

### "punishmentRole"
An id of a Discord role used with the punishment "role". The punishment type "role" does not work without this id.

Example 1: "punishmentRole": "363004559863316484"

### "silentMode"
Whether to publicly inform that an action was made. E.g. "User was banned because of not allowed content.". If enabled, this middleware will never post anything.

Example 1: "silentMode": false

### "onlyNoRoles"
You can target badcontent to users without roles only. These actors are usually bots that only briefly visit your channel to spam. If you are targeting bots, it is recommended to keep this setting on true.

Example 1: "onlyNoRoles": true

### "illegalContent"
Content that should not be posted or you will get punished by this middleware. Make sure to not make too vague definitions. Bots usually repeat the one and only message, so you should target directly to that message.

The following are real-world examples. Do not visit the sites!

Example 1: "illegalContent": ["Sex Dating >", ".amazingsexdating.com"]
