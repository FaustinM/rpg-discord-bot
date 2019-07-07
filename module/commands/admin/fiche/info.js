const messages = require('../../../variable/message');
const listEmbed = require('../../../variable/embed/fiche');

module.exports = function(args, message, dbUtils){
    if(!args[1]) {
        message.channel.send(messages.USER_INVALID);
    } else {
        dbUtils.infoFiche(args[1], (rsp, data) => {
            switch(rsp) {
                case "nobody":
                    message.channel.send(messages.FICHE_LIST_NOBODY.replace("%1", args[1]));
                    break;

                case false:
                    message.channel.send(messages.ERROR);
                    break;

                case true:
                    const user = message.guild.members.get(data[0].user);
                    const user2 = message.guild.members.get(data[0].createBy);
                    listEmbed.title = "Fiche n°" + args[1];
                    listEmbed.fields[0].value = user.displayName;
                    listEmbed.fields[1].value = data[0].faction;
                    listEmbed.fields[2].value = data[0].name;
                    listEmbed.fields[3].value = data[0].metier;
                    listEmbed.fields[4].value = data[0].role;
                    listEmbed.fields[5].value = user2.displayName;
                    listEmbed.fields[6].value = data[0].date.toLocaleString();
                    message.channel.send({embed : listEmbed});
            }
        })
    }
};