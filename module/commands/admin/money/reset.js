const messages = require('../../../variable/message.js');
const disUtils = require('../../../utils/discordUtils.js');


module.exports = function(dbUtils, args, message) {
    const user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
    if(!user) {
        message.channel.send(messages.USER_INVALID);
    } else {
        dbUtils.setMoney(user.id, 300, (data) => {
            switch(data) {
                case "nobody" :
                    user.send(messages.MONEY_START.replace("%1", "Libertown").replace("%2", "300"));
                    break;

                case "modify" :
                    user.send(messages.MONEY_START.replace("%1", "Libertown").replace("%2", "300"));
                    break;

                case false:
                    console.error(user.id + " : Erreur lors du don de début !");
                    break;
            }
        })
    }
};