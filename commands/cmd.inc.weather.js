/**
 * Weather information.
 * 
 * Command: weather
 * Author: Ari Höysniemi
 */
const request = require('request');
module.exports = (Debug, Strings, Client, Auth, cmd) => {
    const module = {};

    // Command strings
    const stringsJSON = Strings.get(['commands', cmd]);
    const apiKey = Auth.fmi_api_key;

    /**
     * Returns the current temperature of a location.
     * @returns {number}
     */
    const getTemperature = (location) => {
        request
        .get(`http://data.fmi.fi/fmi-apikey/${apiKey}/wfs?request=getFeature&storedquery_id=fmi::observations::weather::daily::simple&place=${location}`)
        .on('response', (res) => {
            console.log('res');
        })
        .on('error', (e) => {
            Debug.print(`Executing ${cmd} getTemperature failed.`, `${cmd.toUpperCase()} ERROR`, true, e);
        });
        // http://data.fmi.fi/fmi-apikey/APIKEY/wfs?request=getFeature&storedquery_id=fmi::observations::weather::daily::simple&place=helsinki 
        return false
    };

    /**
     * Executes this command.
     * @returns {boolean}
     */
    module.execute = (payload) => {
        try {
            // const { Message } = payload;
            getTemperature('Oulu');

            return false;
        } catch (e) {
            Debug.print(`Executing ${cmd} failed.`, `${cmd.toUpperCase()} ERROR`, true, e);
            return false;
        }
    };

    module.disabled = true;

    return module;
}
