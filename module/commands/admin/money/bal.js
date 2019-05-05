const messages = require('../../../variable/message');
const disUtils = require('../../../utils/discordUtils.js');

module.exports = function(dbUtils, args, message) {
    const user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
    if(!user) {
        message.channel.send(messages.USER_INVALID);

    } else {
        dbUtils.checkMoney(user.id, (rsp, data) => {
            switch(rsp) {
                case false:
                    message.channel.send(messages.ERROR);
                    break;

                case "nobody":
                    message.channel.send(messages.MONEY_NOBODY_OTHER.replace("%1", args[1]));
                    break;

                case true:
                    message.channel.send(messages.MONEY_BALANCE_ADMIN.replace("%2", data.toString()).replace("%1", args[1]));
                    break;
            }
        })
    }
};