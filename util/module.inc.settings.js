/**
 * Implements settings functionality.
 */
const fs = require('fs');
module.exports = (Debug) => {
    const module = {};

    // Make sure strings.json exists.
    if (!fs.existsSync('./config/settings.json')) {
        Debug.print('config/settings.json is missing. The process will now exit.', 'SETTINGS CRITICAL');
        process.exit(1);
    }

    // Load the resource file.
    const SettingsJSON = require('../config/settings.json');
    Debug.print('Settings file settings.json loaded.', 'SETTINGS');

    /**
     * Returns a setting value.
     */
    module.get = (strArr) => {
        try {
            // Read a setting.
            return strArr.reduce((o, n) => o[n], SettingsJSON);
        } catch (e) {
            Debug.print('Returning settings value failed.', 'SETTINGS ERROR', true, e);
            return undefined;
        }
    }

    return module;
};
