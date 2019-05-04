messages = require('../../variable/message.js');
disUtils = require('../../utils/discordUtils.js');

module.exports = function(args, dbUtils) {
    if(!message.guild) {
        message.channel.send(messages.DM_BLOCK);
        return;
    }
    if(args.length > 0 && message.member.permissions.has("ADMINISTRATOR")) {
        let channelID;
        let channelArgs;
        let nameAlias;
        switch(args[0]) {
            default:
                break;
            case "alias":
                if(args.length >= 3) {
                    switch(args[1]) {
                        case "add" :
                            channelArgs = message.guild.channels.get(args[2]) || message.guild.channels.find(channel => channel.name === args[2]) || message.guild.channels.get(disUtils.getChannel(args[2]));
                            if(channelArgs) channelID = channelArgs.id;
                            else {
                                message.channel.send(messages.CHANNEL_INVALID);
                                return;
                            }
                            nameAlias = args.slice(3).join(" ").toLowerCase();
                            dbUtils.addAlias(channelID, nameAlias, (data) => {
                                switch(data) {
                                    case "nobody":
                                        message.channel.send(messages.ALIAS_INVALID);
                                        break;
                                    case true:
                                        message.channel.send(messages.ALIAS_MODIFY.replace("%1", channelID.toString()).replace("%2", nameAlias.toString()));
                                        break;
                                    case "two":
                                        message.channel.send(messages.ALIAS_EXIST);
                                        break;
                                    case false:
                                        message.channel.send(messages.ERROR);
                                        break;
                                }
                            });
                            break;

                        case "remove" :
                            nameAlias = args.slice(2).join(" ").toLowerCase();
                            dbUtils.removeAlias(nameAlias, (data) => {
                                switch(data) {
                                    case true:
                                        message.channel.send(messages.ALIAS_REMOVE.replace("%1", nameAlias.toString()));
                                        break;
                                    case false:
                                        message.channel.send(messages.ERROR);
                                        break;
                                    case "nobody" :
                                        message.channel.send(messages.ALIAS_NOBODY);
                                        break;

                                }
                            });
                            break;

                        case "list" :
                            channelArgs = message.guild.channels.get(args[2]) || message.guild.channels.find(channel => channel.name === args[2]) || message.guild.channels.get(disUtils.getChannel(args[2]));
                            if(!channelArgs) {
                                message.channel.send(messages.CHANNEL_INVALID)
                            } else {
                                dbUtils.findAlias(channelArgs.id, (rsp, data) => {
                                    switch(rsp) {
                                        case "nobody":
                                            message.channel.send(messages.ALIAS_CHANNEL_NOBODY);
                                            break;

                                        case false:
                                            message.channel.send(messages.ERROR);
                                            break;

                                        case true:

                                            message.channel.send(messages.ALIAS_LIST);
                                            for(let key in data) {
                                                /** @param {{alias: string}} data[key] */
                                                if(data.hasOwnProperty(key)) message.channel.send(data[key].alias.toString());
                                            }
                                    }
                                })
                            }

                    }

                } else {
                    message.delete(0);
                }
                break;

            case "role":
                const channel = message.guild.channels.get(args[2]) || message.guild.channels.find(channel => channel.name === args[1]) || message.guild.channels.get(disUtils.getChannel(args[2]));
                if(channel) {
                    const role = message.guild.roles.get(args[1]) || message.guild.roles.find(channel => channel.name === args[1]) || message.guild.roles.get(disUtils.getRole(args[1]));
                    if(role) {
                        dbUtils.addRole(channel.id, role.id, (data) => {
                            switch(data) {
                                case "modify":
                                    message.channel.send(messages.ROLE_MODIFY.replace("%1", args[1]).replace("%2", args[2]));
                                    break;

                                case "add":
                                    message.channel.send(messages.ROLE_DEFINE.replace("%1", args[1]).replace("%2", args[2]));
                                    break;

                                case false:
                                    message.channel.send(messages.ERROR);
                                    break;

                            }
                        })
                    } else {
                        message.channel.send(messages.ROLE_INVALID);
                    }
                } else {
                    message.channel.send(messages.CHANNEL_INVALID);
                }
        }
    } else {
        message.delete(0);
    }
};