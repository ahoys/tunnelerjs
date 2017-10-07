// nodeunit commands/mw.antispam/tests/test.getAnalysisAvg.js
const stringAnalysis = require('string-analysis-js');

let Analyse;

exports.averageOfTwo = (test) => {
  Analyse = require('../parts/module.inc.analyse')();
  const result = Analyse.getAnalysisAvg([0, 0, 1, 0], 2);
  test.deepEqual(result, [0, 0, 0.5, 0], result);
  test.done();
}

exports.averageOfTen = (test) => {
  Analyse = require('../parts/module.inc.analyse')();
  const result = Analyse.getAnalysisAvg([1, 0.5, 1, 0], 10);
  test.deepEqual(result, [0.1, 0.05, 0.1, 0], result);
  test.done();
}
