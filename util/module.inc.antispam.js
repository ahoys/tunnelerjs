const stringAnalysis = require('string-analysis-js');
module.exports = () => {
    const module = {};
    const messageBuffer = {};
    const maxBufferLength = 8;

    module.saveToBuffer = (Message) => {
        try {
            const {guild, author} = Message;
            if (messageBuffer[guild.id]) {
                const userBuffer = messageBuffer[guild.id][author.id];
                if (userBuffer) {
                    // The index key must loop, replacing the old messages.
                    const i = userBuffer.index < maxBufferLength
                    ? userBuffer.index + 1
                    : 0;
                    messageBuffer[guild.id][author.id].messages[i] = Message;
                    messageBuffer[guild.id][author.id].index = i;
                } else {
                    // A new user registered.
                    messageBuffer[guild.id][author.id] = {
                        index: 0,
                        messages: [Message],
                    };
                }
            } else {
                // A new message buffer for a guild.
                messageBuffer[guild.id] = {};
                messageBuffer[guild.id][author.id] = [Message];
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    const isRepeatingMessages = (messages) => {
        try {
            const p = stringAnalysis
            .getPercentageOfRepetitiveStructure(messages);
            return p > 0.5;
        } catch (e) {
            return false;
        }
    }

    const isRepeatingContent = (message) => {
        try {
            const p = stringAnalysis
            .getPercentageOfRepetitiveStructure(message, ' ');
            const len = message.length;
            if (len > 8 && len <= 32) {
                return p > 0.9;
            } else if (len > 32 && len <= 64) {
                return p > 0.8;
            } else if (len > 64 && len <= 128) {
                return p > 0.7;    
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    const isUpperCase = () => {
        try {
            return false;
        } catch (e) {
            return false;
        }
    }

    module.getUserAnalysis = (authorId, guildId) => {
        try {
            if (
                !messageBuffer[guildId] ||
                !messageBuffer[guildId][authorId]
            ) return {};
            const messages = messageBuffer[guildId][authorId];
            const lastMessage = messages[messages.length - 1];
            const data = {
                isRepeatingMessages: isRepeatingMessages(messages),
                isRepeatingContent: isRepeatingContent(lastMessage),
                isUpperCase: isUpperCase(lastMessage),
                
            };
        } catch (e) {
            return {};
        }
    }

    return module;
}
