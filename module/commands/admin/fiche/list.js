const messages = require('../../../variable/message');
const disUtils = require('../../../utils/discordUtils');
const listEmbed = require('../../../variable/embed/fiches');

module.exports = function(args, message, dbUtils) {
    dbUtils.findFiche((rsp, data) => {
        switch(rsp) {
            case "nobody":
                message.channel.send(messages.METIER_LIST_NOBODY);
                break;

            case false:
                message.channel.send(messages.ERROR);
                break;

            case true:
                listEmbed.title = listEmbed.title.replace("%1", user.displayName);
                for(let key in data) {
                    if(data.hasOwnProperty(key)) {
                        let createdBy = message.guild.members.get(data[key].createBy);
                        if(data[key].statut === "alive") listEmbed.fields.push({
                            "name" : data[key]._id,
                            "value" : ":white_check_mark:" + data[key].date.toLocaleString() + " - " + createdBy.displayName
                        });
                        else if(data[key].statut === "mort") listEmbed.fields.push({
                            "name" : data[key]._id,
                            "value" : ":x:" + data[key].date.toLocaleString() + "-" + createdBy.displayName
                        })
                    }
                }
                message.channel.send({embed : listEmbed});
                listEmbed.fields = [];
        }
    })
};