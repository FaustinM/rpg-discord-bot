const messages = require('../../variable/message');
module.exports = function(message, args) {
    if(!message.guild) {
        message.channel.send(messages.DM_BLOCK);
    }
    if(message.member.permissions.has("ADMINISTRATOR")) {
        const user = message.guild.members.get(args[0]) || message.guild.members.find(user => user.nickname === args[0]) || message.guild.members.get(disUtils.getChannel(args[0]));
        const dest = message.guild.channels.get(args[1]) || message.guild.channels.find(channel => channel.name === args[1]) || message.guild.channels.get(disUtils.getChannel(args[1]));
        if(!dest) {
            message.channel.send(messages.CHANNEL_INVALID);
        } else if(!user) {
            message.channel.send(messages.USER_INVALID);
        } else if(user && dest) {
            const lost = message.guild.channels.find(channel => channel.memberPermissions(user).has("READ_MESSAGES") && channel.memberPermissions(user).has("SEND_MESSAGES") && (channel.type === "text") === true);
            lost.overwritePermissions(user, {READ_MESSAGES : null}, messages.LOG_MOVE).catch(console.error);
            dest.overwritePermissions(user, {READ_MESSAGES : true}).catch(console.error);
        }
    } else {
        message.delete(0);
    }
}