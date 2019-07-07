const changeChannel = require("../../utils/channel");

module.exports = function(message, dbUtils){
    if(!message.guild) {
        message.channel.send(messages.DM_BLOCK);
    }
    const lieu = message.content.substring(19, message.content.length - 1).toLowerCase();
    const lieuC = message.guild.channels.find(channel => channel.name === lieu) || message.guild.channels.get(lieu);
    if(lieuC) {
        changeChannel(lieuC, message, dbUtils);
    } else {
        dbUtils.findChannel(lieu, (data, rsp) => {
            const aliasDest = message.guild.channels.get(rsp);
            switch(data) {
                case false:
                    message.delete(0);
                    break;
                case true:
                    changeChannel(aliasDest, message, dbUtils);
                    break;
                case "nobody":
                    message.delete(0);
            }
        })
    }
};