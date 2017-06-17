const {print, log} = require('../util/module.inc.debug')();

module.exports = () => {
    const module = {};
    const allowedTypes = ['string', 'boolean', 'number', 'array', 'object'];

    const isValidType = (subject) => {
        try {
            if (allowedTypes.indexOf(subject) >= 0) {
                return true;
            };
            print(`Not supported type (${subject}).`, 'validate');
        } catch (e) {
            print(`Validating type failed (${subject})`,
                'validate', true, e);
        }
        return false;
    }

    const isValidIsRequired = (subject) => {
        try {
            if (typeof subject === 'boolean') {
                return true;
            }
            print(`Not supported isRequired (${subject}).`, 'validate');
        } catch (e) {
            print(`Validating isRequired failed (${subject})`,
                'validate', true, e);
        }
        return false;
    }

    const isValidDefaultValue = (subject, type) => {
        try {
            if (isValidType(type)) {
                if (
                    type === 'array' &&
                    typeof subject === 'object' &&
                    subject.constructor === Array
                ) {
                    return true;
                } else if (typeof subject === type) {
                    return true;
                }
                print(`Not supported default value (${subject}).`, 'validate');
                return false;
            }
            print(`Not supported type (${type}).`, 'validate');
        } catch (e) {
            print(`Validating default value failed (${subject}, ${type})`,
                'validate', true, e);
        }
        return false;
    }

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
                            if (isValidType(thisParameter)) {
                                settingFrame[pKey] = thisParameter;
                                i = i + 1;
                            }
                            break;
                        case 'isRequired':
                            if (isValidIsRequired(thisParameter)) {
                                settingFrame[pKey] = thisParameter;
                                i = i + 1;
                            }
                            break;
                        case 'defaultValue':
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
                    print(`Setting (${key}) is invalid and therefore ignored.`,
                        'validate');
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
