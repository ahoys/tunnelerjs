// nodeunit commands/mw.antispam/tests/test.getAnalysis.js
const stringAnalysis = require('string-analysis-js');
const toolsTemplate = Object.keys(stringAnalysis.getAll()).map(x => 0);
toolsTemplate.push(0);

let Analyse;
const authorLogTemplate = [
    {
        content: '',
        createdTimestamp: 360000
    }
]

const generate = (len, str = 'a', split = '') => {
    let result = '';
    for (let i = 0; i < len; ++i) {
        result = `${result}${str}${split}`;
    }
    return result;
}

exports.emptyString = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.getAnalysis(authorLogTemplate);
    test.deepEqual(result, toolsTemplate, result);
    test.done();
}

exports.basicString = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const thisLog = authorLogTemplate;
    thisLog[0].content = 'test';
    const result = Analyse.getAnalysis(thisLog);
    test.deepEqual(result, toolsTemplate, result);
    test.done();
}

exports.spamRepetitiveStructure = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const thisLog = authorLogTemplate;
    thisLog[0].content = generate(3,
        'This is just a test. Cant you understand that? You idiot. '
        + 'You should be well aware that Im spamming!'
        , ' ');
    const result = Analyse.getAnalysis(thisLog);
    test.deepEqual(result[0] > 0.8, true, result);
    test.done();
}

exports.spamShortWords = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const thisLog = authorLogTemplate;
    thisLog[0].content = 'a b c d';
    const result = Analyse.getAnalysis(thisLog);
    test.deepEqual(result[1], 1, result);
    test.done();
}

exports.spamLongWords = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const thisLog = authorLogTemplate;
    thisLog[0].content = generate(20);
    const result = Analyse.getAnalysis(thisLog);
    test.deepEqual(result[2], 1, result);
    test.done();
}

exports.spamIdenticalChars = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const thisLog = authorLogTemplate;
    thisLog[0].content = generate(20);
    const result = Analyse.getAnalysis(thisLog);
    test.deepEqual(result[3], 1, result);
    test.done();
}
