// nodeunit util/tests/test.getListOfType.js

let Parser;

exports.oneString = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.getListOfType(['a'], 'string');
  test.deepEqual(result, ['a'], result);
  test.done();
}

exports.multipleStrings = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.getListOfType(['a', 'b'], 'string');
  test.deepEqual(result, ['a', 'b'], result);
  test.done();
}

exports.mixedContent = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.getListOfType(['a', true, 'b'], 'string');
  test.deepEqual(result, ['a', 'b'], result);
  test.done();
}

exports.noValidContent = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.getListOfType(['a', true, 'b'], 'number');
  test.deepEqual(result, [], result);
  test.done();
}

exports.invalidType = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.getListOfType(['a'], 1);
  test.deepEqual(result, [], result);
  test.done();
}

exports.nonArrayList = (test) => {
  Parser = require('../module.inc.parser')();
  const result = Parser.getListOfType(13, 'number');
  test.deepEqual(result, [13], result);
  test.done();
}
