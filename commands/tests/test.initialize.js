// nodeunit commands/tests/test.initialize.js

let Commands;

const cmdTemplate = require('../cmd.ping/command.json');
cmdTemplate.jsPath = './commands/cmd.ping/index.js';
const mwTemplate = require('../mw.antispam/middleware.json');
mwTemplate.jsPath = './commands/mw.antispam/index.js';

exports.readCmdSetup = (test) => {
  Commands = require('../index')();
  const result = Commands.initialize();
  test.deepEqual(
    result.cmdMap.ping,
    cmdTemplate, result);
  test.done();
}

exports.readMwSetup = (test) => {
  Commands = require('../index')();
  const result = Commands.initialize();
  test.deepEqual(
    result.mwMap.antispam,
    mwTemplate, result);
  test.done();
}
