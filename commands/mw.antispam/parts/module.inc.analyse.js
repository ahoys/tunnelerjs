const {print} = require('../../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');

module.exports = () => {
    const module = {};

    // Available tools.
    const tools = stringAnalysis.getAll();
    const toolsTemplate = Object.keys(tools).map(x => 0);
    toolsTemplate.push(0);

    /**
     * Returns value of c.
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @return {number}
     */
    const getDirectlyProportionalAnalysis = (a, b, c) => {
        try {
            return (b * c) / (a || 1);
        } catch (e) {
            print(`Could not return a directly proportional analysis.`, name,
                true, e);
        }
        return 0;
    }

    /**
     * Returns analysis for a string.
     * @param {array} authorLog
     */
    module.getAnalysis = (authorLog) => {
        try {
            const content = authorLog[authorLog.length - 1].content;
            if (!content.length) return toolsTemplate;
            const result = tools.map(x => {
                if (x.parameters.content.indexOf('string') !== -1) {
                    return x.func(content);
                }
                return 0;
            });
            // Combine the log and look for repetitive structure.
            result.push(stringAnalysis.getPercentageOfRepetitiveStructure(
                authorLog.reduce((prev, curr) => {
                    return prev === ''
                        ? curr.content : `${prev} ${curr.content}`;
                }, '')
            ));
            return result;
        } catch (e) {
            print(`getAnalysis failed.`, 'parts/analyse',
                true, e);
        }
        return toolsTemplate;
    }

    /**
     * Returns an array of analysis sums.
     */
    module.getAppendedSums = (sums, last, max) => {
        try {
            const len = sums.length;
            if (!len) return [last];
            sums[len] = sums[len - 1].map((x, i) => {
                return x + last[i];
            });
            if (len >= max) sums.shift();
            return sums;
        } catch (e) {
            print(`getAppendedSums failed.`, 'antispam/analyse',
                true, e);
        }
    }

    /**
     * Returns an average of the sums.
     */
    module.getAnalysisAvg = (sum, len) => {
        try {
            return sum.map(x => x / len);
        } catch (e) {
            print(`getAnalysisAvg failed.`, 'antispam/analyse',
                true, e);
        }
        return toolsTemplate;
    }

    /**
     * Returns whether the values can be considered as spam.
     */
    module.isSpamming = (avg, len = 1) => {
        try {
            return getDirectlyProportionalAnalysis(
                16, 1, Math.max.apply(null, avg || [0]) * len) >= 0.5;
        } catch (e) {
            print(`getCertainty failed.`, 'antispam/analyse',
                true, e);
        }
        return 0;
    }

    /**
     * Returns the severity of the possible spam.
     */
    module.getSeverity = (analysisObj) => {
        try {
            const joined = analysisObj.joinedTimeStamp;
        } catch (e) {
            print(`getSeverity failed.`, 'antispam/analyse',
                true, e);
        }
        return 0;
    }

    return module;
}
