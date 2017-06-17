// nodeunit commands/tests/test.validate.js

let Validate;

const validTemplate = {
    "warnings": {
            "type": "boolean",
            "isRequired": false,
            "defaultValue": true
        },
        "punishment": {
            "type": "string",
            "isRequired": false,
            "defaultValue": "warn"
        },
        "punishmentRole": {
            "type": "string",
            "isRequired": false,
            "defaultValue": ""
        },
        "silentMode": {
            "type": "boolean",
            "isRequired": false,
            "defaultValue": false,
    }
}

exports.isValid = (test) => {
    Validate = require('../module.inc.validate')();
    const result = Validate.getValidatedGuildSettings(validTemplate);
    test.deepEqual(result, validTemplate, result);
    test.done();
}
