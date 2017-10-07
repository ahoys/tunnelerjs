// nodeunit commands/mw.antispam/tests/test.getAppendedSums.js
const stringAnalysis = require('string-analysis-js');

let Analyse;

exports.addFirstSum = (test) => {
  Analyse = require('../parts/module.inc.analyse')();
  const result = Analyse.getAppendedSums([], [0, 1, 0, 0], 2);
  test.deepEqual(result, [[0, 1, 0, 0]], result);
  test.done();
}

exports.addSecondSum = (test) => {
  Analyse = require('../parts/module.inc.analyse')();
  const result = Analyse.getAppendedSums(
    [[0, 0.5]], [0.1, 0.2], 2);
  test.deepEqual(result, [[0, 0.5], [0.1, 0.7]], result);
  test.done();
}

exports.addShiftingSum = (test) => {
  Analyse = require('../parts/module.inc.analyse')();
  const result = Analyse.getAppendedSums(
    [[0, 0.5]], [0.1, 0.2], 1);
  test.deepEqual(result, [[0.1, 0.7]], result);
  test.done();
}
