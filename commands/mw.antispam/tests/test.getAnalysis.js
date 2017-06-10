// nodeunit commands/mw.antispam/tests/test.getAnalysis.js
const stringAnalysis = require('string-analysis-js');
const toolsTemplate = Object.keys(stringAnalysis.getAll()).map(x => 0);

let Analyse;

const generate = (len, str = 'a', split = '') => {
    let result = '';
    for (let i = 0; i < len; ++i) {
        result = `${result}${str}${split}`;
    }
    return result;
}

exports.emptyString = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.getAnalysis('');
    test.deepEqual(result, toolsTemplate, result);
    test.done();
}

exports.basicString = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.getAnalysis('test');
    test.deepEqual(result, toolsTemplate, result);
    test.done();
}

exports.spamRepetitiveStructure = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.getAnalysis(
        generate(3,
        'This is just a test. Cant you understand that? You idiot. '
        + 'You should be well aware that Im spamming!'
        , ' '));
    test.deepEqual(result[0] > 0.8, true, result);
    test.done();
}

exports.spamShortWords = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.getAnalysis('a b c d');
    test.deepEqual(result[1], 1, result);
    test.done();
}

exports.spamLongWords = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.getAnalysis(generate(20));
    test.deepEqual(result[2], 1, result);
    test.done();
}

exports.spamIdenticalChars = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.getAnalysis(generate(20));
    test.deepEqual(result[3], 1, result);
    test.done();
}
