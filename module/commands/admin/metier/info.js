const messages = require('../../../variable/message');
const listEmbed = require('../../../variable/embed/metier/metier');

module.exports = function(args, message, dbUtils){
    if(!args[1]) {
        message.channel.send(messages.USER_INVALID);
    } else {
        dbUtils.infoMetier(args[1], (rsp, data) => {
            switch(rsp) {
                case "nobody":
                    message.channel.send(messages.METIER_INVALID);
                    break;

                case false:
                    message.channel.send(messages.ERROR);
                    break;

                case true:
                    const name = data[0].name.charAt(0).toUpperCase() + data[0].name.slice(1);
                    const user = message.guild.members.get(data[0].createBy);
                    listEmbed.title = "Métier : " + name;
                    listEmbed.fields[0].value = name;
                    listEmbed.fields[1].value = data[0].earn;
                    listEmbed.fields[2].value = data[0].time;
                    listEmbed.fields[3].value = user.displayName;
                    listEmbed.fields[4].value = data[0].date.toLocaleString();
                    message.channel.send({embed : listEmbed});
            }
        })
    }
};