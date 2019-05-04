const messages = require('../../../variable/message.js');
const disUtils = require('../../../utils/discordUtils.js');

module.exports = function(dbUtils, args, message){
    const user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
    const nbMoney = Number(args[2]);
    if(!user) {
        message.channel.send(messages.USER_INVALID);
    } else if(isNaN(nbMoney)) {
        message.channel.send(messages.NAN);
    } else {
        dbUtils.modifyMoney(user.id, -nbMoney, (rsp) => {
            switch(rsp) {
                case false:
                    message.channel.send(messages.ERROR);
                    break;

                case "nobody":
                    message.channel.send(messages.MONEY_NEGATIVE_ADMIN.replace("%1", args[1]));
                    break;

                case "modify":
                    message.channel.send(messages.MONEY_REMOVE.replace("%2", nbMoney.toString()).replace("%1", args[1]));
                    break;
            }
        })
    }
};