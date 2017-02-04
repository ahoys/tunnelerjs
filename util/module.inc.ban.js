module.exports = () => {

    const module = {};

    module.execute = (target) => {
        if (target.bannable) {
            const ban = target.ban(1);
            ban.then((value) => {
                console.log(`${target.user.username} was banned.`);
                return true;
            }).catch((reason) => {
                console.log(`Ban of ${target.user.username} failed: ${reason}`);
                return false;
            })
        }
        return false;
    };

    return module;
};