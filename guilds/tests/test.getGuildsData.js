// nodeunit guilds/tests/test.getGuilds.js
const fs = require('fs');

let Guilds;

const reg = new RegExp(/^\d{18}$/);
const guilds = [];
fs.readdirSync('./guilds')
.filter(
    x => reg.test(x) &&
    fs.lstatSync(`./guilds/${x}`).isDirectory()
).forEach((id) => {
    guilds.push({id, json: require(`../${id}/guild.json`)});
});

exports.canLoadAvailableGuilds = (test) => {
    Guilds = require('../index')({cmdMap: {}, mwMap: {}});
    const result = Guilds.getGuildsData();
    test.deepEqual(result, guilds, result);
    test.done();
}
