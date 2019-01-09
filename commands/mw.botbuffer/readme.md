# mw.botbuffer

Removes messages that are sent too soon after joining the server.
Many bots spam and leave immediately. This feature is crafted to encounter that.

## Guild Settings
### "noTalkTimeInSeconds"
Time in seconds during the user should not type a message, or he is considered to be a bot.

Value: number

Example 1: "noTalkTimeInSeconds": 5

### "maxAttempts"
After how many attempts (of sending a message too early) will the user get kicked?

Value: number

Example 1: "maxAttempts": 3

### "neverAllowBotsToSpeak"
If your server is a fully bot free zone when it comes to chatting, you can make this feature to remove all the messages that are recognized to be sent by bots. This won't affect bots that don't type.

Value: boolean (true/false)

Example 1: "neverAllowBotsToSpeak": false

### "checkOnlyRecognizedBots"
If the bot is properly registered and set, Discord should detect it to be a bot. In this case we can target this feature to affect only messages typed by bots. However, it is good to realize that many malware bots have found ways to circumvent this check.

Value: boolean (true/false)

Example 1: "checkOnlyRecognizedBots": false

### "silentMode"
Don't say anything if a message gets removed. Otherwise the user is informed why his message was deleted.

Value: boolean (true/false)

Example 1: "silentMode": false
