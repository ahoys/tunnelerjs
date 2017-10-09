const { print, log } = require('../../../util/module.inc.debug')();
const sajs = require('string-analysis-js');

module.exports = () => {
  const module = {};

  /**
   * Processes a singular message.
   */
  module.getMessageAnalysis = (message) => {
    try {
      return {
        repetitiveStructure: sajs.getPercentageOfRepetitiveStructure(message),
        shortStrings: sajs.getPercentageOfShortStrings(message),
        longStrings: sajs.getPercentageOfLongStrings(message),
        repetitiveChars: sajs.getPercentageOfRepetitiveChars(message),
        upperCaseChars: sajs.getPercentageOfUpperCaseChars(message),
      }
    } catch (e) {
      print('getMessageAnalysis failed.', 'antispam/analyse', true, e);
    }
    return {};
  }

  /**
   * Returns true if a new violation.
   */
  module.isViolation = (messages = []) => {
    try {
      if (!messages.length) return false;
      const c = messages.length;
      const d = Date.now();

      // The latest message analysis --------------------------
      const msg = messages[c - 1];
      const len = msg.length;
      if (len > 24 && msg.analysis.repetitiveStructure > 0.5) return true;
      if (len > 32 && msg.analysis.shortStrings > 0.5) return true;
      if (len > 64 && msg.analysis.longStrings > 0.5) return true;
      if (len > 8 && msg.analysis.repetitiveChars > 0.5) return true;
      if (len > 8 && msg.analysis.upperCaseChars > 0.5) return true;

      // History analysis -------------------------------------
      // Low duration between messages average.
      // Caution: Network issues may cause a similar effect.
      if (
        c >= 3 &&
        messages.map(x => d - x.editedTimestamp || x.createdTimestamp)
        .reduce((sum, value) => sum + value) / c < 2000
      ) {
        return true;
      }

      // High count of @everyone average.
      if (
        c >= 2 &&
        messages.filter(x => x.everyone).length / c > 0.5
      ) {
        return true;
      }

      // High repetitive structure average.
      if (
        c >= 2 &&
        messages.map(x => x.analysis.repetitiveStructure)
        .reduce((sum, value) => sum + value) / c > 0.5
      ) {
        return true;
      }

      // High short strings average.
      if (
        c >= 2 &&
        messages.map(x => x.analysis.shortStrings)
        .reduce((sum, value) => sum + value) / c > 0.5
      ) {
        return true;
      }

      // High long strings average.
      if (
        c >= 2 &&
        messages.map(x => x.analysis.longStrings)
        .reduce((sum, value) => sum + value) / c > 0.5
      ) {
        return true;
      }

      // High repetitive chars average.
      if (
        c >= 2 &&
        messages.map(x => x.analysis.repetitiveChars)
        .reduce((sum, value) => sum + value) / c > 0.5
      ) {
        return true;
      }

      // High uppercase char average.
      if (
        c >= 2 &&
        messages.map(x => x.analysis.upperCaseChars)
        .reduce((sum, value) => sum + value) / c > 0.5
      ) {
        return true;
      }
    } catch (e) {
      print('isViolation failed.', 'antispam/analyse', true, e);
    }
    return false;
  }

  return module;
}
