const {print} = require('../../util/module.inc.debug')();

/**
 * Replies with a bot uptime.
 * Reboot does not clear the timer.
 * 
 * Author: Ari Höysniemi
 * Data: October 7. 2017
 */
module.exports = (Settings, Strings, name) => {
    const module = {};

    /**
     * Executes the command.
     * @return {string}
     */
    module.execute = () => {
        try {
          const uptime = process.uptime();
          if (uptime < 60) {
            // Seconds
            return `${Strings['success_0']} ${Math.floor(process.uptime())} ${Strings['seconds']}.`;
          } else if (uptime >= 60 && uptime < 3600) {
            // Minutes
            return `${Strings['success_0']} ${Math.floor((process.uptime() / 60))} ${Strings['minutes']}.`;
          } else if (uptime >= 3600 && uptime < 68400) {
            // Hours
            return `${Strings['success_0']} ${Math.floor((process.uptime() / 3600))} ${Strings['hours']}.`;
          }
          // Days
          return `${Strings['success_0']} ${Math.floor((process.uptime() / 68400))} ${Strings['days']}.`;
        } catch (e) {
            print(`Command execution failed.`, name, true, e);
        }
        return '';
    };

    return module;
};
