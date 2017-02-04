# tunnelerjs
A lightweight moderator bot with anti spam capabilities.
Can be used as a simple anti spam bot without any extra features.

**Do note:** The bot is still heavily work in progress.

## Installation Requirements
1) Node.js version 6 or higher installed.

2) NPM (should come with the Node).

3) Registered [Discord application](https://discordapp.com/developers/applications/me/). Must be registered as a client.

## Installation
1) Clone this project to your local computer.

2) Create `auth.json` file into /config dir.

3) Input your [application](https://discordapp.com/developers/applications/me/) credentials into the `auth.json` file.

```
{
  "token": "Your app's token.",
  "id": "Your app's client id."
}
```

4) With a command prompt or such, navigate to the project folder `eg. cd c:/git/tunnelerjs`.

6) Enter `npm install`.

7) From now on you can start the bot with `node tunneler` command.

## Configuration
`config/settings.json` contains settings for the bot. The settings are server specific. If the used server cannot be found from the settings, default settings will be used instead.

You can use your server's id to identificate the server for the bot.

**enable_anti_spam_filtering:** Enables automatic anti-spam measures if set to true. Enabled by default.

**enable_quiet_mode:** Enables quiet mode to anti spam capabilities. No information about the banned spammer is given. Enabled by default.

**enable_client_commands:** Various special features that can be activated with client commands, eg. `@Tunneler ping`. These are disabled by default.
