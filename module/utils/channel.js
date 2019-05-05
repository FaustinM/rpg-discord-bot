module.exports = function(destination, msg, dbUtils) {
    dbUtils.checkRole(destination.id, (state, rsp) => {
        switch(state) {
            default:
                break;

            case false:
                rsp.delete(0);
                break;

            case true:
                if(msg.member.roles.get(rsp)) {
                    msg.channel.overwritePermissions(msg.author, {READ_MESSAGES : null}, "Changement de channel (RP)").catch(console.error);
                    destination.overwritePermissions(msg.author, {READ_MESSAGES : true}).catch(console.error);
                } else {
                    msg.channel.send(messages.CHANNEL_PERM);
                }
        }
    }, msg);
};