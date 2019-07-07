messages = require('../../variable/message.js');
Discord = require('discord.js');

module.exports = function(args, message, commands) {
    if(!args[0]) message.channel.send(messages.ARGUMENT_NOBODY.replace("%1", "1"));
    else {
        switch(args[0]) {
            default:
                break;

            case "statut":
                switch(commands.state(args[2], args[1])) {
                    default:
                        break;

                    case true:
                        message.channel.send(messages.COMMANDS_ON);
                        break;

                    case false:
                        message.channel.send(messages.COMMANDS_OFF);
                        break;

                    case "error":
                        message.channel.send(messages.COMMANDS_ERROR);
                        break;

                    case "nobody":
                        message.channel.send(messages.COMMANDS_NOBODY);
                        break;
                }
                break;

            case "off":
                switch(commands.disable(args[2], args[1])) {
                    default:
                        break;

                    case true:
                        message.channel.send(messages.COMMANDS_OFF);
                        break;

                    case false:
                        message.channel.send(messages.COMMANDS_ERROR);
                        break;

                    case "nobody":
                        message.channel.send(messages.COMMANDS_NOBODY);
                        break;
                }
                break;

            case "on":
                switch(commands.enable(args[2], args[1])) {
                    default:
                        break;

                    case true:
                        message.channel.send(messages.COMMANDS_ON);
                        break;

                    case false:
                        message.channel.send(messages.COMMANDS_ERROR);
                        break;

                    case "nobody":
                        message.channel.send(messages.COMMANDS_NOBODY);
                        break;
                }
                break;

            case "reload":
                commands.load();
                message.channel.send(messages.COMMANDS_RELOAD);
                break;

            case "list":
                let embed = new Discord.RichEmbed();
                embed.setAuthor("Discord RP - Gestionnaire");
                embed.setTitle("Liste des commandes !");
                embed.setColor("#FF0000");
                embed.setTimestamp();
                for(let key in commands.commands){
                    const keyName = key.charAt(0).toUpperCase() + key.slice(1)
                    for(let key1 in commands.commands[key]) {
                        const name = commands.commands[key][key1].name.charAt(0).toUpperCase() + commands.commands[key][key1].name.slice(1);
                        switch(commands.commands[key][key1].use) {
                            default:
                                break;

                            case true:
                                embed.addField(name + " - " + keyName, messages.COMMANDS_LIST_ON, true);
                                break;

                            case false:
                                embed.addField(name + " - " + keyName, messages.COMMANDS_LIST_OFF, true);
                                break;

                            case "error":
                                embed.addField(name + " - " + keyName, messages.COMMANDS_LIST_ERROR, true);
                                break;
                        }
                    }
                }
                message.channel.send({embed});
        }
    }
};