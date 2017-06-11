// nodeunit util/tests/test.trim.js

let Parser;

exports.lowerCaseString = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.trim('test');
    test.equal(result, 'test', result);
    test.done();
}

exports.upperCaseString = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.trim('TEST');
    test.equal(result, 'test', result);
    test.done();
}

exports.mixedCaseString = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.trim('Test');
    test.equal(result, 'test', result);
    test.done();
}

exports.emptyString = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.trim('');
    test.equal(result, '', result);
    test.done();
}

exports.longString = (test) => {
    Parser = require('../module.inc.parser')();
    let str = '';
    for (let i = 0; i < 1000; ++i) {
        str = i === 999
            ? `${str}this is just a test.`
            : `${str}this is just a test. `;
    }
    const result = Parser.trim(str);
    test.equal(result, str, str.length);
    test.done();
}

exports.excessSpaces = (test) => {
    Parser = require('../module.inc.parser')();
    const result = Parser.trim('a  b  c      d');
    test.equal(result, 'a b c d', result);
    test.done();
}
