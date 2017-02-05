const Settings = require('../config/settings.json');
module.exports = () => {

    const module = {};

    /**
     * Returns settings for a single guild.
     * @param gId
     * @param owner
     * @returns {{enable_anti_spam_filtering: boolean, enable_quiet_mode: boolean,
     * enable_client_commands: boolean, max_repeat_of_message: number,
     * max_urls_in_message: number, max_identical_urls_in_message: number, operators: Array}}
     */
    module.getGuildSetting = (gId, owner) => {
        if (Settings.guilds.hasOwnProperty(gId)) {

            // Guild specific settings provided by the owner.
            const readSettings = Settings.guilds[gId];

            readSettings['enable_anti_spam_filtering'] =
                readSettings['enable_anti_spam_filtering'] !== undefined &&
                typeof(readSettings['enable_anti_spam_filtering']) === "boolean"
                    ? readSettings['enable_anti_spam_filtering']
                    : true ;

            readSettings['enable_quiet_mode'] =
                readSettings['enable_quiet_mode'] !== undefined &&
                typeof(readSettings['enable_quiet_mode']) === "boolean"
                    ? readSettings['enable_quiet_mode']
                    : false ;

            readSettings['enable_client_commands'] =
                readSettings['enable_client_commands'] !== undefined &&
                typeof(readSettings['enable_client_commands']) === "boolean"
                    ? readSettings['enable_client_commands']
                    : false ;

            readSettings['anti_spam_allow_unsafe_url_suffixes'] =
                readSettings['anti_spam_allow_unsafe_url_suffixes'] !== undefined &&
                typeof(readSettings['anti_spam_allow_unsafe_url_suffixes']) === "boolean"
                    ? readSettings['anti_spam_allow_unsafe_url_suffixes']
                    : false ;

            readSettings['anti_spam_log_length'] =
                readSettings['anti_spam_log_length'] !== undefined &&
                !isNaN(readSettings['anti_spam_log_length'])
                    ? Math.floor(readSettings['anti_spam_log_length'])
                    : 16 ;

            readSettings['anti_spam_max_identical_urls_in_message'] =
                readSettings['anti_spam_max_identical_urls_in_message'] !== undefined &&
                !isNaN(readSettings['anti_spam_max_identical_urls_in_message'])
                    ? Math.floor(readSettings['anti_spam_max_identical_urls_in_message'])
                    : 4 ;

            readSettings['anti_spam_max_identical_urls_in_total'] =
                readSettings['anti_spam_max_identical_urls_in_total'] !== undefined &&
                !isNaN(readSettings['anti_spam_max_identical_urls_in_total'])
                    ? Math.floor(readSettings['anti_spam_max_identical_urls_in_total'])
                    : 2 ;

            readSettings['anti_spam_max_identical_messages_total'] =
                readSettings['anti_spam_max_identical_messages_total'] !== undefined &&
                !isNaN(readSettings['anti_spam_max_identical_messages_total'])
                    ? Math.floor(readSettings['anti_spam_max_identical_messages_total'])
                    : 8 ;

            readSettings['anti_spam_safe_url_suffixes'] =
                readSettings['anti_spam_safe_url_suffixes'] !== undefined &&
                readSettings['anti_spam_safe_url_suffixes'].constructor === Array
                    ? readSettings['anti_spam_safe_url_suffixes']
                    : ["com", "net", "org", "gov", "edu"] ;

            readSettings['anti_spam_warning_count_before_ban'] =
                readSettings['anti_spam_warning_count_before_ban'] !== undefined &&
                !isNaN(readSettings['anti_spam_warning_count_before_ban'])
                    ? Math.floor(readSettings['anti_spam_warning_count_before_ban'])
                    : 2 ;

            return readSettings;
        } else {
            // Default settings.
            // This list must include all the available settings!
            if (!owner) console.log(`Default settings read for ${gId}.`);
            return {
                "enable_anti_spam_filtering": owner ? false : true,
                "enable_quiet_mode": false,
                "enable_client_commands": owner ? true : false,
                "anti_spam_allow_unsafe_url_suffixes": owner ? true : false,
                "anti_spam_log_length": 16,
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