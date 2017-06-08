// nodeunit util/tests/test.isIncluded.js

let Parser;

exports.includesOneValue = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded('a', ['a']);
    test.equal(result, true, result);
    test.done();
}

exports.includesManyValues = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded(['a', 'c'], ['a', 'b', 'c']);
    test.equal(result, true, result);
    test.done();
}

exports.includesEmptyValues = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded('a', [], [], true);
    test.equal(result, true, result);
    test.done();
}

exports.excludesEmptyValues = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded([], [], [], false);
    test.equal(result, false, result);
    test.done();
}

exports.excludesOneValue = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded('a', [], ['a'], true);
    test.equal(result, false, result);
    test.done();
}

exports.excludesManyValues = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded(['a', 'b', 'c'], [], ['a', 'b'], true);
    test.equal(result, false, result);
    test.done();
}

exports.mixedValuesExludingOverrides = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded(['a', 'b', 'c'], ['a', 'b'], ['a', 'b'], true);
    test.equal(result, false, result);
    test.done();
}

exports.missingTarget = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isIncluded([], [], [], true);
    test.equal(result, false, result);
    test.done();
}
