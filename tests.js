// nodeunit tests.js
const path = require('path');
const fs = require('fs');

// Add folders you don't want to process here.
const ignores = [path.basename(__filename), 'node_modules', '.git'];
const testPaths = [];

// Reads a dir, finding all the tests inside it.
const readDir = (path) => {
  fs.readdirSync(path).forEach((item) => {
    const thisPath = `${path}/${item}`;
    if (
      ignores.indexOf(item) === -1 &&
      fs.lstatSync(thisPath).isDirectory()
    ) {
      if (item === 'tests') {
        // Tests dir found.
        fs.readdirSync(thisPath).forEach((test) => {
          testPaths.push(`${thisPath}/${test}`);
        });
      } else {
        // Sub dir found.
        readDir(thisPath);
      }
    }
  });
}

readDir('.', true);
// Feed the tests to nodeunit.
testPaths.forEach((path) => {
  exports[path] = require(path);
});
