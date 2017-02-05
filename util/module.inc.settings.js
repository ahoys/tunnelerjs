const Settings = require('../config/settings.json');
module.exports = () => {

    const module = {};

    /**
     * Returns settings for a single guild.
     * @param gId
     * @returns {{enable_anti_spam_filtering: boolean, enable_quiet_mode: boolean,
     * enable_client_commands: boolean, max_repeat_of_message: number,
     * max_urls_in_message: number, max_identical_urls_in_message: number, operators: Array}}
     */
    module.getGuildSetting = (gId) => {
        if (Settings.guilds.hasOwnProperty(gId)) {

            // Guild specific settings provided by the owner.
            const readSettings = Settings.guilds[gId];

            readSettings['enable_anti_spam_filtering'] =
                readSettings['enable_anti_spam_filtering'] !== undefined &&
                readSettings['enable_anti_spam_filtering'].isBoolean
                    ? readSettings['enable_anti_spam_filtering']
                    : true ;

            readSettings['enable_quiet_mode'] =
                readSettings['enable_quiet_mode'] !== undefined &&
                readSettings['enable_quiet_mode'].isBoolean
                    ? readSettings['enable_quiet_mode']
                    : false ;

            readSettings['enable_client_commands'] =
                readSettings['enable_client_commands'] !== undefined &&
                readSettings['enable_client_commands'].isBoolean
                    ? readSettings['enable_client_commands']
                    : false ;

            readSettings['anti_spam_mute_instead_of_ban'] =
                readSettings['anti_spam_mute_instead_of_ban'] !== undefined &&
                readSettings['anti_spam_mute_instead_of_ban'].isBoolean
                    ? readSettings['anti_spam_mute_instead_of_ban']
                    : false ;

            readSettings['anti_spam_allow_unsafe_url_suffixes'] =
                readSettings['anti_spam_allow_unsafe_url_suffixes'] !== undefined &&
                readSettings['anti_spam_allow_unsafe_url_suffixes'].isBoolean
                    ? readSettings['anti_spam_allow_unsafe_url_suffixes']
                    : false ;

            readSettings['anti_spam_max_identical_urls_in_message'] =
                readSettings['anti_spam_max_identical_urls_in_message'] !== undefined &&
                !readSettings['anti_spam_max_identical_urls_in_message'].isNaN
                    ? Math.floor(readSettings['anti_spam_max_identical_urls_in_message'])
                    : 4 ;

            readSettings['anti_spam_max_identical_urls_in_total'] =
                readSettings['anti_spam_max_identical_urls_in_total'] !== undefined &&
                !readSettings['anti_spam_max_identical_urls_in_total'].isNaN
                    ? Math.floor(readSettings['anti_spam_max_identical_urls_in_total'])
                    : 2 ;

            readSettings['anti_spam_max_identical_messages_total'] =
                readSettings['anti_spam_max_identical_messages_total'] !== undefined &&
                !readSettings['anti_spam_max_identical_messages_total'].isNaN
                    ? Math.floor(readSettings['anti_spam_max_identical_messages_total'])
                    : 8 ;

            readSettings['anti_spam_safe_url_suffixes'] =
                readSettings['anti_spam_safe_url_suffixes'] !== undefined &&
                readSettings['anti_spam_safe_url_suffixes'].constructor === Array
                    ? Math.floor(readSettings['anti_spam_safe_url_suffixes'])
                    : 2 ;

            readSettings['anti_spam_warning_count_before_ban'] =
                readSettings['anti_spam_warning_count_before_ban'] !== undefined &&
                !readSettings['anti_spam_warning_count_before_ban'].isNaN
                    ? Math.floor(readSettings['anti_spam_warning_count_before_ban'])
                    : 2 ;

            return readSettings;
        } else {
            // Default settings.
            // This list must include all the available settings!
            return {
                "enable_anti_spam_filtering": true,
                "enable_quiet_mode": false,
                "enable_client_commands": true,
                "anti_spam_mute_instead_of_ban": false,
                "anti_spam_allow_unsafe_url_suffixes": false,
                "anti_spam_max_identical_urls_in_message": 2,
                "anti_spam_max_identical_urls_in_total": 3,
                "anti_spam_max_identical_messages_total": 8,
                "anti_spam_safe_url_suffixes": ["com", "net", "org", "gov", "edu"],
                "anti_spam_warning_count_before_ban": 1
            }
        }
    };

    return module;
};