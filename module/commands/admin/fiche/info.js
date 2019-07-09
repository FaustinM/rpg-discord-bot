const messages = require('../../../variable/message');
const listEmbed = require('../../../variable/embed/fiche');
const ObjectID = require('mongodb').ObjectID;

module.exports = function(args, message, dbUtils){
    if(!args[1]) {
        message.channel.send(messages.USER_INVALID);
    } else if(!ObjectID.isValid(args[1])) {
        message.channel.send(messages.NOT_OBJECTID);
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
                    if(data[0].faction) listEmbed.fields[1].value = data[0].faction;
                    else listEmbed.fields[1].value = ":x:";
                    if(data[0].name) listEmbed.fields[2].value = data[0].name;
                    else listEmbed.fields[2].value = ":x:";
                    if(data[0].metier)listEmbed.fields[3].value = data[0].metier;
                    else listEmbed.fields[3].value = ":x:";
                    if(data[0].role)listEmbed.fields[4].value = data[0].role;
                    else listEmbed.fields[4].value = ":x:";
                    listEmbed.fields[5].value = user2.displayName;
                    listEmbed.fields[6].value = data[0].date.toLocaleString();
                    message.channel.send({embed : listEmbed});
            }
        })
    }
};