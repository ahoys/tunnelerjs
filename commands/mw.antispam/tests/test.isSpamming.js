// nodeunit commands/mw.antispam/tests/test.isSpamming.js
const stringAnalysis = require('string-analysis-js');

let Analyse;

exports.notSpam = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.isSpamming([0, 0, 0, 0], 100);
    test.equal(result, false, result);
    test.done();
}

exports.isSpam0 = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.isSpamming([0, 0.5, 0, 0], 100);
    test.equal(result, true, result);
    test.done();
}

exports.isSpam1 = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const result = Analyse.isSpamming([0, 1, 0, 0], 100);
    test.equal(result, true, result);
    test.done();
}
