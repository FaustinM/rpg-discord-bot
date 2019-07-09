const messages = require('../../../variable/message');
const disUtils = require('../../../utils/discordUtils');

/**
 * Cette fonction crée une fiche dans la base de donnée
 *
 * @param {Array} args - Les arguments
 * @param {module:discord.js.Message} message - Le message
 * @param {Object} dbUtils - Object de dbUtils.js
 *
 */

module.exports = function(args, message, dbUtils){
    const user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
    if(!user) {
        message.channel.send(messages.USER_INVALID);
    } else {
        dbUtils.createFiche(user.id, message.author.id, (data)=>{
            switch(data) {
                case "first" :
                    message.channel.send(messages.FICHE_NEW.replace("%1", user.displayName));
                    user.send(messages.FICHE_ACCEPT);
                    break;

                case "two" :
                    message.channel.send(messages.FICHE_NEW_TWO.replace("%1", user.displayName));
                    break;

                case false:
                    message.channel.send(messages.ERROR);
                    break;
            }
        })
    }

};