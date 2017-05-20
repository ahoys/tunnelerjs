
/**
 * Tools for parsing.
 * @param {object} Debug
 * @return {object}
 */
module.exports = (Debug) => {
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
            Debug.print('Verifying string safetyness failed.',
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
            Debug.print('Trimming a string failed.', 'PARSER ERROR', true, e);
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
            Debug.print('Looking for a first match failed.',
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
            Debug.print('Looking for valid list entries failed.',
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
            const includesIsArray = typeof includes === 'object' &&
            includes.constructor === Array;
            const excludesIsArray = typeof excludes === 'object' &&
            excludes.constructor === Array;
            // No target, cannot be included: false.
            if (target === undefined) return false;
            // Can be found from exclusions: false.
            if (
                excludesIsArray &&
                excludes.indexOf(target) >= 0
            ) return false;
            // Can be found from inclusions: true.
            if (
                includesIsArray &&
                includes.indexOf(target) >= 0
            ) return true;
            // emptyIncludes and no includes: true.
            if (
                emptyIncludes &&
                includesIsArray &&
                !includes.length
            ) return true;
            return false;
        } catch (e) {
            Debug.print('Determining includement failed.',
            'PARSER ERROR', true, e);
            return false;
        }
    };

    return module;
};
