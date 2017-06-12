// nodeunit commands/mw.antispam/tests/test.execute.js
const stringAnalysis = require('string-analysis-js');

let AntiSpam;
const settings = require('../middleware.json').settings;
const name = 'antispam';
const message = {
    author: {
        id: "123123123123123",
    },
    content: '',
    createdTimestamp: Date.now(),
    member: {
        joinedTimestamp: Date.now(),
    }
};
const guildSettings = require('../../../guilds/template.json')
    .middlewares.antispam;

exports.basicExecution = (test) => {
    AntiSpam = require('../index')(settings, name);
    const thisMessage = message;
    thisMessage.content = 'test';
    const result = AntiSpam.execute(thisMessage, guildSettings);
    test.equal(result, '', result);
    test.done();
}
