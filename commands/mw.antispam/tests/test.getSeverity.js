// nodeunit commands/mw.antispam/tests/test.getSeverity.js
const stringAnalysis = require('string-analysis-js');

let Analyse;
const authorTemplate = {
    "joinedTimestamp": 3600000,
    "analysisObj": {
        "log": [],
        "last": [0, 0, 0, 0],
        "sums": [0, 0, 0, 0],
        "avg": [0, 0, 0, 0],
        "violationCount": 0,
    },
    "warningCount": 0,
}

exports.severityOf0 = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const thisTemplate = authorTemplate;
    const result = Analyse.getSeverity(thisTemplate);
    test.equal(result, 0, result);
    test.done();
}

exports.severityOf5 = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const thisTemplate = authorTemplate;
    const result = Analyse.getSeverity(thisTemplate);
    test.equal(result, 0, result);
    test.done();
}

exports.severityOf10 = (test) => {
    Analyse = require('../parts/module.inc.analyse')();
    const thisTemplate = authorTemplate;
    const result = Analyse.getSeverity(thisTemplate);
    test.equal(result, 0, result);
    test.done();
}
