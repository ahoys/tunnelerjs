/**
 * Implements localization functionality.
 */
const fs = require('fs');
module.exports = (Debug) => {
    const module = {};

    // Make sure strings.json exists.
    if (!fs.existsSync('./config/strings.json')) {
        Debug.print('config/strings.json is missing. The process will now exit.', 'STRINGS CRITICAL');
        process.exit(1);
    }

    // Load the resource file.
    const StringsJSON = require('../config/strings.json');
    Debug.print('Strings file strings.json loaded.', 'STRINGS');

    /**
     * Returns a localized string.
     */
    module.get = (strArr, loc) => {
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
