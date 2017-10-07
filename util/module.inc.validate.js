/**
 * module.inc.validate
 * Ari Höysniemi
 * June 15, 2017
 * 
 * Validates custom guild setting restrictions.
 */
module.exports = (customDefaults, customDataTypes) => {
  const module = {};
  // If a default value is not found or is invalid,
  // give an default default value instead :)
  const defaults = customDefaults ||
    {
      'null': '',
      'string': '',
      'boolean': false,
      'array': [],
      'number': 0,
      'object': {},
    };
  // Data types that are currently allowed and supported.
  // This can be probably extended without other modifications.
  const dataTypes = customDataTypes ||
    ['boolean', 'string', 'number', 'array', 'object'];

  /**
   * Returns whether the given data type is supported.
   * @param {*} type
   * @return {boolean}
   */
  const isValidDataType = (type) => {
    if (dataTypes.indexOf(type) >= 0) {
      return true;
    } else if (
      typeof type === 'object' &&
      type.constructor === Array
    ) {
      // A list of types.
      if (
        type.map(x => x.toLowerCase())
          .filter(x => !isValidDataType(x)).length === 0
      ) {
        // No invalid types were found.
        return true;
      }
    }
    // Validation failed, print the reason and exit.
    print(`The given type (${key.type}) is not supported. `
      + `See the log for the supported types.`,
      'validate', true,
      `Supported data types: ${dataTypes}.`);
    return false;
  };

  /**
   * Returns whether the defaultValue match the given data type.
   * @param {*} type
   * @param {*} value
   * @return {boolean}
   */
  const isValidDefaultValue = (type, value) => {
    if (type === typeof value) return true;
    if (typeof type === 'object' && type.constructor === Array) {
      // A list of type. Only one has to match.
      return type.map(x => x.toLowerCase()).indexOf(typeof value) >= 0;
    }
    return false;
  }

  /**
   * Returns a sanitized type collection.
   * @param {object} variableFrames
   * @return {object}
   */
  module.getTypeTemplate = (variableFrames = {}) => {
    try {
      const returnFrame = {};
      Object.keys(variableFrames).forEach((key) => {
        // Types can be eg. "string", ["string", "boolean"], etc.
        const type = typeof key.type === 'string'
          ? key.type.toLowerCase() : key.type;
        returnFrame[key].type = isValidDataType(type)
          ? type : 'null';
        returnFrame[key].isRequired = typeof key
          .isRequired === 'boolean'
          ? key.isRequired : defaults.boolean;
        returnFrame[key].defaultValue = isValidDefaultValue(
          returnFrame[key].type, key.defaultValue)
          ? key.defaultValue
          : defaults[returnFrame[key].type];
      });
      return returnFrame;
    } catch (e) {
      print('Failed to return a type template.', 'validate', true, e);
    }
    return {};
  }

  return module;
}
