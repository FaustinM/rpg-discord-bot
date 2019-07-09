messages = require('../../variable/message.js');
data = require('../../variable/help');
embed = require('../../variable/embed/help');

module.exports = function(args, message, dbUtils, bot) {

    if(!args[0]){
        embed.fields = [];
        embed.fields.push({
            "name" : "Commande admin",
            "value" : "\u200B",
        });
        for(let key in data.admin){
            if(data.admin.hasOwnProperty(key)) embed.fields.push({
                "name" : data.admin[key].name,
                "value" : data.admin[key].description,
            });
        }
        embed.fields.push({
            "name" : "\u200B",
            "value" : "\u200B",
        });
        embed.fields.push({
            "name" : "Commande RP",
            "value" : "\u200B",
        });
        for(let key in data.rp){
            if(data.admin.hasOwnProperty(key)) embed.fields.push({
                "name" : data.rp[key].name,
                "value" : data.rp[key].description,
            });
        }
        message.reply({embed : embed})
    }
    else {
        let find = false;
        for(let key in data.admin){
            if(data.admin.hasOwnProperty(key) && data.admin[key].name === args[0]){
                find = true;
                let tempEmbed = Object.create(embed);
                tempEmbed.fields = [];
                tempEmbed.title = "Description de " + data.admin[key].name;
                tempEmbed.description = data.admin[key].description;
                if(data.admin[key].subcommands.length === 0){
                    tempEmbed.fields.push({
                        "name" : ":frowning2: Aucune sous-commande n'existe pour cette commande",
                        "value" : "\u200B",
                    });
                    message.channel.send({embed : tempEmbed});
                    break;
                }
                for(let key2 in data.admin[key].subcommands){
                    if(data.admin[key].subcommands.hasOwnProperty(key2)) tempEmbed.fields.push({
                        "name" : data.admin[key].subcommands[key2].name,
                        "value" : data.admin[key].subcommands[key2].description,
                    });
                }
                message.channel.send({embed : tempEmbed});
                break;
            }

        }
        if(!find) message.channel.send(messages.HELP_NOBODY)
    }


};