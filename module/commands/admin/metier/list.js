const messages = require('../../../variable/message');
const disUtils = require('../../../utils/discordUtils');
const listEmbed = require('../../../variable/embed/metier/metiers');

module.exports = function(args, message, dbUtils) {
    dbUtils.findMetiers((rsp, data) => {
        switch(rsp) {
            case "nobody":
                message.channel.send(messages.METIER_LIST_NOBODY);
                break;

            case false:
                message.channel.send(messages.ERROR);
                break;

            case true:
                for(let key in data) {
                    if(data.hasOwnProperty(key)) {
                        let createdBy = message.guild.members.get(data[key].createBy);
                        const name = data[key].name.charAt(0).toUpperCase() + data[key].name.slice(1);
                        listEmbed.fields.push({
                            name : name + " par " + createdBy.displayName + " le " + data[key].date.toLocaleString(),
                            value : " Gain de " + data[key].earn + " tous les " + data[key].time + " ms",
                            inline : false
                        })
                    }
                }
                message.channel.send({embed : listEmbed});
                listEmbed.fields = [];
        }
    })
};