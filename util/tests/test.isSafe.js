// nodeunit util/tests/test.isSafe.js

let Parser

exports.simpleString = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isSafe('Just a sentence.');
    test.equal(result, true, result);
    test.done();
}

exports.allowedChars = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isSafe('a-zA-Z0-9.?:!;)("`\',+-=@#¤%&/=^*§½£$€ ');
    test.equal(result, true, result);
    test.done();
}

exports.notAllowedChar = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isSafe('_');
    test.equal(result, false, result);
    test.done();
}

exports.emptyString = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isSafe('');
    test.equal(result, true, result);
    test.done();
}

exports.invalidString = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isSafe({test: 12});
    test.equal(result, false, result);
    test.done();
}

exports.number = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isSafe(12);
    test.equal(result, true, result);
    test.done();
}

exports.array = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.isSafe(['a', 'b']);
    test.equal(result, true, result);
    test.done();
}
