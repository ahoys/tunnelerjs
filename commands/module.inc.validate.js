const {print} = require('../util/module.inc.debug')();

/**
 * Validator of modules' guild settings.
 * 
 * Ari Höysniemi
 * June 17. 2017
 */
module.exports = () => {
    const module = {};
    const allowedTypes = ['string', 'boolean', 'number', 'array', 'object'];

    /**
     * Returns whether the given subject is a valid type value.
     * @param {string} subject
     * @return {boolean}
     */
    const isValidType = (subject) => {
        try {
            if (allowedTypes.indexOf(subject) >= 0) {
                // The given type was found from the allowed types.
                return true;
            };
            print(`Not supported type (${subject}).`, 'validate');
        } catch (e) {
            print(`Validating type failed (${subject})`,
                'validate', true, e);
        }
        return false;
    }

    /**
     * Returns whether the given subject is a valid isRequired value.
     * @param {string} subject
     * @return {boolean}
     */
    const isValidIsRequired = (subject) => {
        try {
            if (typeof subject === 'boolean') {
                // The given isRequired is of valid type.
                return true;
            }
            print(`Not supported isRequired (${subject}).`, 'validate');
        } catch (e) {
            print(`Validating isRequired failed (${subject})`,
                'validate', true, e);
        }
        return false;
    }

    /**
     * Returns whether the given subject is a valid default value.
     * This depends of the given type.
     * @param {string} subject
     * @param {string} type
     * @return {boolean}
     */
    const isValidDefaultValue = (subject, type) => {
        try {
            if (isValidType(type)) {
                if (
                    typeof subject === type ||
                    type === 'array' &&
                    typeof subject === 'object' &&
                    subject.constructor === Array
                ) {
                    // The given default value is of valid type.
                    return true;
                }
                print(`Not supported default value (${subject}) for `
                    + `(${type}).`, 'validate');
                return false;
            }
            print(`Not supported type (${type}).`, 'validate');
        } catch (e) {
            print(`Validating default value failed (${subject}, ${type})`,
                'validate', true, e);
        }
        return false;
    }

    /**
     * Returns validated guild settings.
     * The validation is strict. Invalid values are ignored.
     * @param {object} guildSettings
     * @return {object}
     */
    module.getValidatedGuildSettings = (guildSettings) => {
        try {
            const returnFrame = {};
            // Go through all setting keys.
            // eg. mySetting.
            Object.keys(guildSettings).forEach((key) => {
                const settingFrame = {};
                let i = 0;
                // Go through all setting parameters.
                // Eg. type, isRequired and defaultValue.
                Object.keys(guildSettings[key]).forEach((pKey) => {
                    const thisParameter = guildSettings[key][pKey];
                    switch (pKey) {
                        case 'type':
                            // "type" defines the type of the setting.
                            // Eg. string, boolean, etc.
                            if (isValidType(thisParameter)) {
                                settingFrame[pKey] = thisParameter;
                                i = i + 1;
                            }
                            break;
                        case 'isRequired':
                            // "isRequired" defines whether the settings
                            // is required for the module to work.
                            if (isValidIsRequired(thisParameter)) {
                                settingFrame[pKey] = thisParameter;
                                i = i + 1;
                            }
                            break;
                        case 'defaultValue':
                            // "devaultValue" defines the default value for
                            // the setting, if a value is not given.
                            // The value is never used if the setting
                            // isRequired but should still be defined.
                            if (
                                isValidDefaultValue(
                                    thisParameter, guildSettings[key]['type'])
                            ) {
                                settingFrame[pKey] = thisParameter;
                                i = i + 1;
                            }
                            break;
                        default:
                            print(`Not supported guild setting (${key})`,
                                'validate');
                    }
                });
                if (i === 3) {
                    // All values found and valid.
                    // Register the setting.
                    returnFrame[key] = settingFrame;
                } else {
                    // Invalid result, inform the user.
                    print(`Setting (${key}) has an invalid configuration and `
                        + `is therefore ignored.`, 'validate');
                }
            });
            return returnFrame;
        } catch (e) {
            print(`Could not validate guild settings.`, 'validate', true, e);
        }
        return {};
    }

    return module;
}
