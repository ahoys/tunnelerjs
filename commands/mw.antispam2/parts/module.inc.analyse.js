const { print, log } = require('../../../util/module.inc.debug')();
const sajs = require('string-analysis-js');

module.exports = () => {
  const module = {};

  /**
   * Returns true if a new violation.
   */
  module.isViolation = (msg = '', msgHistory = [], Settings) => {
    try {
      // Individual message analysis.
      const rStructure = sajs.getPercentageOfRepetitiveStructure(
        msg, Settings['splitter']);
      const pOfShortStrings = sajs.getPercentageOfShortStrings(
        msg, Settings['splitter'], Settings['shortWordLength']);
      const pOfLongStrings = sajs.getPercentageOfLongStrings(
        msg, Settings['splitter'], Settings['longWordLength']);
      const pOfRepetitiveChars = sajs.getPercentageOfRepetitiveChars(
        msg, Settings['repetitiousChars']);
      const len = msg.length;
      if (len > 16 && rStructure >= 0.9) return true;
      if (len > 128 && pOfShortStrings >= 0.5) return true;
      if (len > 64 && pOfLongStrings >= 0.5) return true;
      if (len > 10 && pOfRepetitiveChars >= 0.5) return true;
    } catch (e) {
      print('isViolation failed.', 'antispam/analyse', true, e);
    }
    return false;
  }

  return module;
}
