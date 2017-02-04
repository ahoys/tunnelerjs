# tunnelerjs
A lightweight moderator bot with anti spam capabilities.
Can be used as a simple anti spam bot without any extra features.

## Installation Requirements
1) Node.js version 6 or higher installed.

2) NPM (should come with the Node).

## Installation
1) Clone this project to your local computer.

2) Create `auth.json` file into /config dir.

3) Input your [application](https://discordapp.com/developers/applications/me/277192029069377537) credentials into the `auth.json` file.

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
`config/settings.json` contains settings for the bot. The settings are server specific.

Use your server's id to recognize the server, see the included default settings.json for examples.


**enable_anti_spam_filtering:** Enables automatic anti-spam measures if set to true.

**enable_quiet_mode:** When true, automatic actions are done in silence. Otherwise the bot will inform the channel about the bot.

**enable_client_commands:** Various special features that can be activated with client commands, eg. `@Tunneler ping`
