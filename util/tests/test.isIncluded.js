// nodeunit util/tests/test.isIncluded.js

exports.includesOneValue = (test) => {
    const Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded('a', ['a']);
    test.equal(result, true, result);
    test.done();
}

exports.includesManyValues = (test) => {
    const Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded(['a', 'c'], ['a', 'b', 'c']);
    test.equal(result, true, result);
    test.done();
}

exports.includesEmptyValues = (test) => {
    const Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded('a', [], [], true);
    test.equal(result, true, result);
    test.done();
}

exports.excludesEmptyValues = (test) => {
    const Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded([], [], [], false);
    test.equal(result, false, result);
    test.done();
}

exports.excludesOneValue = (test) => {
    const Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded('a', [], ['a'], true);
    test.equal(result, false, result);
    test.done();
}

exports.excludesManyValues = (test) => {
    const Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded(['a', 'b', 'c'], [], ['a', 'b'], true);
    test.equal(result, false, result);
    test.done();
}

exports.mixedValuesExludingOverrides = (test) => {
    const Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded(['a', 'b', 'c'], ['a', 'b'], ['a', 'b'], true);
    test.equal(result, false, result);
    test.done();
}

exports.missingTarget = (test) => {
    const Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded([], [], [], true);
    test.equal(result, false, result);
    test.done();
}
