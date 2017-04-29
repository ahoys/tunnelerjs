# tunnelerjs
A lightweight moderator bot with anti spam capabilities.
Can be used as a simple anti spam bot without any extra features.

Do note: source code above is work in progress for the next build. See releases if you'd 
like to download a working copy.

## Installation Requirements
1) [Node.js](https://nodejs.org/en/) version 6 or higher installed.

2) NPM (should come with the Node).

3) Registered [Discord application](https://discordapp.com/developers/applications/me/). Must be registered as a client.

## Installation
1) [Download](https://github.com/ahoys/tunnelerjs/archive/v.0.9.5.zip) source files to your local computer (v.0.9.5.).

2) Create `auth.json` file into `/config` dir. On windows, make sure your file extensions are not hidden (default), otherwise you'll end up having e.g. `auth.json.txt` instead of `auth.json`.

3) Input your [application](https://discordapp.com/developers/applications/me/) credentials into the `auth.json` file. See the syntax below.

```
{
  "token": "Your app's token.",
  "id": "Your app's client id.",
  "owner": "Your own discord id."
}
```

4) With a command prompt or such, navigate to the project folder. E.g. on windows: `cd c:/git/tunnelerjs`. Make sure the path becomes active. If your drive letter is something else than c, try inputting the letter after the cd-command: `c:`.

5) Enter `npm install`. This will download all the required 3rd party components, like Discord.js.

6) From now on you can start the bot with a `node tunneler` command. Remember, you can also create a .bat file for the startup process.

7) Invite the bot to your servers via a regular web browser. Use the following url: `https://discordapp.com/oauth2/authorize?&client_id=YOUR_APP_CLIENT_ID_HERE&scope=bot&permissions=0 `. Replace `YOUR_APP_CLIENT_ID_HERE` with the application id of the bot.

## Configuration (optional)
`config/settings.json` contains settings for the bot. The settings are server (guild) specific. If the used server cannot be found from the settings, default settings will be used instead.

Use your server's id (e.g. `"123123123123123123"`) to identificate the server for the bot. You can find your Discord server's id from the server settings, under Widget.

**"enable_anti_spam_filtering":** The main anti spam capabilities. `true: enabled, false: disabled`

**"enable_quiet_mode":** Disables all speaking capabilities of the bot. `true: enabled, false: disabled`

**"enable_client_commands":** Allows all clients to input harmless commands like ping. `true: enabled, false: disabled`

**"anti_spam_allow_unsafe_url_suffixes":** Immediately removes links with unsafe extensions. `true: enabled, false: disabled`

**"anti_spam_log_length":** Length of the user specific log. This should always be higher than the other max-setting numbers below. `Number`

**"anti_spam_max_identical_urls_in_message":** How many identical urls there can be in a message before a warning or ban. `Number`

**"anti_spam_max_identical_urls_in_total":** How many identical urls there can be in the last 8 messages before a warning or ban. `Number`

**"anti_spam_max_identical_messages_total":** How many identical messages there can be in the last 8 messages before a warning or ban. `Number`

**"anti_spam_safe_url_suffixes":** List of safe URL-extensions. `Number`

**"anti_spam_warning_count_before_ban":** How many warnings are given before banning the user. `Number`

## Custom commands (optional)
You can also script your own custom commands. Here's how you can integrate them with the bot:

1) Add your script into `/commands` dir. Please see the correct syntax from the other command files.

2) Add your command into command mapping `/config/commands.json`. The key is the command word inputted by a client, the value is the actual mapped command script. For example `module.inc.about` turns into `about`. You can have multiple command words for a single command script.

3) Register your command in `tunneler.js`, `const commands`. There should be sufficient amount of examples present.

4) Reboot the bot and you are done.
