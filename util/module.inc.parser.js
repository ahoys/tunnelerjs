const {print} = require('./module.inc.debug')();

/**
 * Tools for parsing.
 * @return {object}
 */
module.exports = () => {
    const module = {};

    /**
     * Returns whether a string has only whitelisted characters.
     * @param {string} str
     * @return {boolean}
     */
    module.isSafe = (str) => {
        try {
            // Only the following characters are allowed.
            return /^[a-zA-Z0-9.?:!;><)("`',\+-=@#¤%&/=^*§½£$€ ]+$/.test(str);
        } catch (e) {
            print('Verifying string safetyness failed.',
            'PARSER ERROR', true, e);
            return false;
        }
    };

    /**
     * Returns a fully trimmed string.
     * @param {string} str
     * @return {boolean}
     */
    module.trim = (str) => {
        try {
            // Lower case and no excess spaces.
            return str.replace(/\s+/g, ' ').toLowerCase().trim();
        } catch (e) {
            print('Trimming a string failed.', 'PARSER ERROR', true, e);
            return '';
        }
    };

    /**
     * Returns the first match found.
     * Options are given in an array,
     * string is the material to go through.
     * @param {Array} arr
     * @param {string} str
     * @return {string}
     */
    module.firstMatch = (arr, str) => {
        try {
            const len = arr.length;
            for (let i = 0; i < len; ++i) {
                if (str.includes(arr[i])) {
                    return arr[i];
                }
            }
            return '';
        } catch (e) {
            print('Looking for a first match failed.',
            'PARSER ERROR', true, e);
            return '';
        }
    };

    /**
     * Returns all the items of a list that have a
     * valid type.
     * @param {Array} list
     * @param {string} type
     * @return {Array}
     */
    module.getListOfType = (list = [], type = 'string') => {
        try {
            if (
                typeof list !== 'object' ||
                list.constructor !== Array
            ) return [];
            return list.filter((x) => typeof x === type);
        } catch (e) {
            print('Looking for valid list entries failed.',
            'PARSER ERROR', true, e);
            return [];
        }
    };

    /**
     * Returns whether a target is included in an array.
     * Supports also layering exlusions.
     * An empty include array can be turned into "everything" with
     * emptyIncludes. This is handy if you only use excludes.
     * @param {*} target
     * @param {Array} includes
     * @param {Array} excludes
     * @param {boolean} emptyIncludes
     * @return {boolean}
     */
    module.isIncluded = (target, includes, excludes, emptyIncludes) => {
        try {
            // No target, cannot be included: false.
            if (target === undefined) return false;
            // Transform target into an array.
            targets = typeof target === 'object' &&
                target.constructor === Array ? target : [target];
            const includesIsArray = typeof includes === 'object' &&
                includes.constructor === Array;
            const excludesIsArray = typeof excludes === 'object' &&
                excludes.constructor === Array;
            let isIncluded = false;
            for (let t in targets) {
                if (excludesIsArray && excludes.indexOf(t) >= 0) {
                    // Can be found from exclusions: false.
                    isIncluded = false;
                    break;
                }
                if (includesIsArray && includes.indexOf(t) >= 0) {
                    // Can be found from inclusions: true.
                    isIncluded = true;
                }
                if (emptyIncludes && includesIsArray && !includes.length) {
                    // emptyIncludes and no includes: true.
                    isIncluded = true;
                }
            }
            return isIncluded;
        } catch (e) {
            print('Determining includement failed.',
            'PARSER ERROR', true, e);
        }
        return false;
    };

    return module;
};
