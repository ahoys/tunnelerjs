// nodeunit util/tests/test.firstMatch.js

let Parser;

exports.oneMatch = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.firstMatch(['a'], 'a');
  test.equal(result, 'a', result);
  test.done();
}

exports.multipleMatches = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.firstMatch(['a', 'a', 'b', 'b'], 'b');
  test.equal(result, 'b', result);
  test.done();
}

exports.noMatch = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.firstMatch(['a'], 'c');
  test.equal(result, '', result);
  test.done();
}

exports.invalidList = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.firstMatch('a', 'c');
  test.equal(result, '', result);
  test.done();
}

exports.missingString = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.firstMatch('a');
  test.equal(result, '', result);
  test.done();
}
