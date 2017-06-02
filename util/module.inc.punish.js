module.exports = () => {

    const module = {};

    module.execute = (target, settingsContainer) => {
        const punishment = settingsContainer['anti_spam_punishment'];
        if (punishment === 'ban' && target.bannable) {
            const ban = target.ban(1);
            ban.then((v) => {
                console.log(`${target.user.username} was banned. (code: ${v})`);
            }).catch((e) => {
                console.log(`Ban of ${target.user.username} failed: ${e}`);
            });
        } else if (punishment === 'kick' && target.kickable) {
            const kick = target.kick(1);
            kick.then((v) => {
                console.log(`${target.user.username} was kicked. (code: ${v})`);
            }).catch((e) => {
                console.log(`Kick of ${target.user.username} failed: ${e}`);
            });
        } else if (punishment === 'role') {
            const role = settingsContainer['anti_spam_punishment_role_id'];
            if (role !== undefined && !target.roles[role]) {
                // Role found.
                const role = target.addRole(role);
                role.then(() => {
                    console.log(`${target.user.username} was assigned to a role.`);
                }).catch((e) => {
                    console.log(`Assigning a role for ${target.user.username} failed: ${e}`);
                });
            }
        } else {
            console.log(`Punishment type (${punishment}) is not supported.`);
        }
        return true;
    };

    return module;
};
