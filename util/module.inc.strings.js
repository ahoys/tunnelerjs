/**
 * Implements localization functionality.
 */
const fs = require('fs');
module.exports = (Debug, lang = 'en') => {
    const module = {};

    // Make sure strings.json exists.
    if (!fs.existsSync('./config/strings.json')) {
        Debug.print('config/strings.json is missing. The process will now exit.', 'STRINGS CRITICAL');
        process.exit(1);
    }

    // Load the resource file.
    const StringsJSON = require('../config/strings.json');
    Debug.print('Strings file strings.json loaded.', 'STRINGS');

    // Make sure a valid language is given.
    if (typeof lang !== 'string' || lang.length < 1) {
        Debug.print('Invalid localization parameter given. The process will now exit.', 'STRINGS CRITICAL');
        process.exit(1);
    }

    /**
     * Returns a localized string.
     */
    module.get = (strArr, loc = lang) => {
        try {
            // Construct the full path and find the string.
            const path = strArr.reduce((o, n) => o[n], StringsJSON);
            return path.loc || path.default;
        } catch (e) {
            Debug.print('Returning string failed.', 'STRINGS ERROR', true, e);
            return '';
        }
    }
    
    return module;
}
