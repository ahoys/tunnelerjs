const { print } = require('../../util/module.inc.debug')();

/**
 * Reconnecting handle.
 * @return {object}
 */
module.exports = () => {
  const module = {};

  /**
   * Executes the handle.
   */
  module.handle = () => {
    print('Client reconnecting...', 'Handler');
  };

  return module;
};
