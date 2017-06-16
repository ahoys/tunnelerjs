const {print, log} = require('../util/module.inc.debug')();

module.exports = () => {
    const module = {};

    module.isValidType = (subject) => {
        try {
            return true;
        } catch (e) {
            print(`Validating type failed (${subject})`,
                'validate', true, e);
        }
        return false;
    }

    module.isValidIsRequired = (subject) => {
        try {
            return true;
        } catch (e) {
            print(`Validating isRequired failed (${subject})`,
                'validate', true, e);
        }
        return false;
    }

    module.isValidDefaultValue = (subject, type) => {
        try {
            return true;
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
                // Go through all setting parameters.
                // Eg. type, isRequired and defaultValue.
                Object.keys(guildSettings[key]).forEach((pKey) => {
                    const thisParameter = guildSettings[key][pKey];
                    let i;
                    switch (pKey) {
                        case 'type':
                            if (this.isValidType(thisParameter)) {
                                settingFrame[pKey] = thisParameter;
                                i = i + 1;
                            }
                            break;
                        case 'isRequired':
                            if (this.isValidIsRequired(thisParameter)) {
                                settingFrame[pKey] = thisParameter;
                                i = i + 1;
                            }
                            break;
                        case 'defaultValue':
                            if (this.isValidDefaultValue(thisParameter)) {
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
