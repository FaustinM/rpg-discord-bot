const messages = require('../../../variable/message');
const disUtils = require('../../../utils/discordUtils');
const listEmbed = require('../../../variable/embed/fiches');


module.exports = function(args, message, dbUtils) {
    const user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
    if(!user) {
        message.channel.send(messages.USER_INVALID);
    } else {
        const filter = (reaction, user) => {
            return reaction.emoji.name === '✅' && user.id === message.author.id;
        };
        message.channel.send(messages.FICHE_MORT_CHECK.replace("%1", user.displayName)).then((msg) =>{
            msg.react("✅");
            msg.awaitReactions(filter, {max : 1, time : 60000, errors : ['time']})
                .then(collected => {
                    dbUtils.modifyFiche(user.id, "statut", "mort", (rsp, data) => {
                        switch(rsp) {
                            case "nobody":
                                message.channel.send(messages.FICHE_ACTIVE_NOBODY.replace("%1", user.displayName));
                                break;

                            case false:
                                message.channel.send(messages.ERROR);
                                break;

                            case "modify":
                                message.channel.send(messages.FICHE_MORT.replace("%1", user.displayName))
                        }
                    });
                    msg.delete();
                })
                .catch(collected => {
                    message.channel.send(messages.FICHE_MORT_TIME.replace("%1", user.displayName));
                    setTimeout(5000, () =>{msg.delete()})
                });
        })
    }
};