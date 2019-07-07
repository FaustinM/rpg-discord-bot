const messages = require('../../../variable/message');
const disUtils = require('../../../utils/discordUtils');
const listEmbed = require('../../../variable/embed/fiches');

element = ["metier", "name", "faction", "role"];

module.exports = function(args, message, dbUtils) {
    const user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
    if(!user) {
        message.channel.send(messages.USER_INVALID);
    } else if(!element.includes(args[2])) {
        message.channel.send(messages.FICHE_MODIFY_ELEMENT);
    } else {
        dbUtils.modifyFiche(user.id, args[2], args[3], (rsp, data) => {
            switch(rsp) {
                case "nobody":
                    message.channel.send(messages.FICHE_ACTIVE_NOBODY.replace("%1", user.displayName));
                    break;

                case false:
                    message.channel.send(messages.ERROR);
                    break;

                case "modify":
                    message.channel.send(messages.FICHE_MODIFY)
            }
        })
    }
};