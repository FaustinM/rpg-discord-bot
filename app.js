const Discord = require('discord.js');
const config = require('./module/variable/config');
const disUtils = require('./module/utils/discordUtils');
let dbUtils = require('./module/utils/dbUtils');
const embedVar = {
    help : require('./module/variable/help'),
};

const userCommands = require('./module/variable/userCommand');
const messages = require('./module/variable/message');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.on('ready', function() {
    console.log("Je suis connecté !");
});

bot.on('guildMemberAdd', (member) => {
    if(!member.user.bot){
        member.send(messages.JOIN);
    }
});

dbUtils.client.connect(function(error) {
    if(error) throw error;
    dbUtils.client.db(config.NAME_DB);
    console.log("Connecté à la base de donnée du bot");
    console.log("Nombre de fiche : " + dbUtils.client.db(config.NAME_DB).collection("Fiche").estimatedDocumentCount({}, (err, num) => {
        return num
    }))
});

function changeChannel(destination, msg) {
    dbUtils.checkRole(destination.id, (state, rsp) => {
        switch(state) {
            default:
                break;

            case false:
                rsp.delete(0);
                break;

            case true:
                if(msg.member.roles.get(rsp)) {
                    msg.channel.overwritePermissions(msg.author, {READ_MESSAGES : null}, "Changement de channel (RP)").catch(console.error);
                    destination.overwritePermissions(msg.author, {READ_MESSAGES : true}).catch(console.error);
                } else {
                    msg.channel.send(messages.CHANNEL_PERM);
                }
        }
    }, msg);
}

function startMoney(user) {
    dbUtils.setMoney(user.id, 300, (data) => {
        switch(data) {
            case "nobody" :
                user.send(messages.MONEY_START.replace("%1", "Libertown").replace("%2", "300"));
                break;

            case "modify" :
                user.send(messages.MONEY_START.replace("%1", "Libertown").replace("%2", "300"));
                break;

            case false:
                console.error(user.id + " : Erreur lors du don de début !");
                break;
        }
    })
}

bot.on('message', message => {
    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if(message.content.startsWith("*sors pour aller à") && message.content.endsWith("*")) {
        const lieu = message.content.substring(19, message.content.length - 1).toLowerCase();
        const lieuC = message.guild.channels.find(channel => channel.name === lieu) || message.guild.channels.get(lieu);
        if(lieuC) {
            changeChannel(lieuC, message);
        } else {
            dbUtils.findChannel(lieu, (data, rsp) => {
                const aliasDest = message.guild.channels.get(rsp);
                switch(data) {
                    case false:
                        message.delete(0);
                        break;
                    case true:
                        changeChannel(aliasDest, message);
                        break;
                    case "nobody":
                        message.delete(0);
                }
            })
        }
    } else if(userCommands.money.includes(message.content)) {
        dbUtils.checkMoney(message.author.id, (rsp, money) => {
            switch(rsp) {
                case true:
                    message.author.send(messages.MONEY_BALANCE.replace("%1", money));
                    break;

                case false:
                    message.delete(0);
                    break;

                case "nobody":
                    message.author.send(messages.MONEY_NOBODY);
                    break;
            }
        })
    }

    switch(command) {
        default:
            break;
        case "!channel":
            if(!message.guild.available) {
                message.channel.send(messages.DM_BLOCK);
                break;
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
                                    if(!channelArgs){
                                        message.channel.send(messages.CHANNEL_INVALID)
                                    } else {
                                        dbUtils.findAlias(channelArgs.id, (rsp, data) => {
                                            switch(rsp){
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
            break;
        case "!move":
            if(message.member.permissions.has("ADMINISTRATOR")) {
                const user = message.guild.members.get(args[0]) || message.guild.members.find(user => user.nickname === args[0]) || message.guild.members.get(disUtils.getChannel(args[0]));
                const dest = message.guild.channels.get(args[1]) || message.guild.channels.find(channel => channel.name === args[1]) || message.guild.channels.get(disUtils.getChannel(args[1]));
                if(!dest) {
                    message.channel.send(messages.CHANNEL_INVALID);
                } else if(!user) {
                    message.channel.send(messages.USER_INVALID);
                } else if(user && dest) {
                    const lost = message.guild.channels.find(channel => channel.memberPermissions(user).has("READ_MESSAGES") && channel.memberPermissions(user).has("SEND_MESSAGES") && (channel.type === "text") === true);
                    lost.overwritePermissions(user, {READ_MESSAGES : null}, messages.LOG_MOVE).catch(console.error);
                    dest.overwritePermissions(user, {READ_MESSAGES : true}).catch(console.error);
                }
            } else {
                message.delete(0);
            }
            break;

        case "!help":
            if(message.member.permissions.has("ADMINISTRATOR")) {
                message.reply({embed : embedVar.help});
            } else {
                message.delete(0);
            }
            break;

        case "!money":
            let user;
            let nbMoney;
            if(!message.guild.available) {
                message.channel.send(messages.DM_BLOCK);
                break;
            }
            if(message.member.permissions.has("ADMINISTRATOR")) {
                switch(args[0]) {
                    default:
                        break;

                    case "add":
                        user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
                        nbMoney = Number(args[2]);
                        if(!user) {
                            message.channel.send(messages.USER_INVALID);
                            break;
                        } else if(isNaN(nbMoney)) {
                            message.channel.send(messages.NAN);
                            break;
                        } else {
                            dbUtils.modifyMoney(user.id, nbMoney, (rsp) => {
                                switch(rsp) {
                                    case false:
                                        message.channel.send(messages.ERROR);
                                        break;

                                    case "add":
                                        message.channel.send(messages.MONEY_START_ADMIN.replace("%2", nbMoney.toString()).replace("%1", args[1]));
                                        break;

                                    case "modify":
                                        message.channel.send(messages.MONEY_ADD.replace("%2", nbMoney.toString()).replace("%1", args[1]));
                                        break;
                                }
                            })
                        }
                        break;

                    case "remove":
                        user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
                        nbMoney = Number(args[2]);
                        if(!user) {
                            message.channel.send(messages.USER_INVALID);
                            break;
                        } else if(isNaN(nbMoney)) {
                            message.channel.send(messages.NAN);
                            break;
                        } else {
                            dbUtils.modifyMoney(user.id, -nbMoney, (rsp) => {
                                switch(rsp) {
                                    case false:
                                        message.channel.send(messages.ERROR);
                                        break;

                                    case "nobody":
                                        message.channel.send(messages.MONEY_NEGATIVE_ADMIN.replace("%1", args[1]));
                                        break;

                                    case "modify":
                                        message.channel.send(messages.MONEY_REMOVE.replace("%2", nbMoney.toString()).replace("%1", args[1]));
                                        break;
                                }
                            })
                        }
                        break;

                    case "bal":
                        user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
                        if(!user) {
                            message.channel.send(messages.USER_INVALID);
                            break;
                        } else {
                            dbUtils.checkMoney(user.id, (rsp, data) => {
                                switch(rsp) {
                                    case false:
                                        message.channel.send(messages.ERROR);
                                        break;

                                    case "nobody":
                                        message.channel.send(messages.MONEY_NOBODY_OTHER.replace("%1", args[1]));
                                        break;

                                    case true:
                                        message.channel.send(messages.MONEY_BALANCE_ADMIN.replace("%2", data.toString()).replace("%1", args[1]));
                                        break;
                                }
                            })
                        }
                        break;

                    case "reset":
                        user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
                        if(!user) {
                            message.channel.send(messages.USER_INVALID);
                            break;
                        } else {
                            startMoney(user);
                        }
                        break;
                }
            } else {
                message.delete(0);
                break;
            }
            break;

        case "!test":
            if(!args[0]) message.channel.send(messages.ARGUMENT_NOBODY.replace("%1", "1"));
            else {
                switch(args[0]){
                    case "msg":
                        if(!args[1]) message.channel.send(messages.ARGUMENT_NOBODY.replace("%1", "2"));
                        else if(!messages[args[1]]) message.channel.send(messages.TEST_MSG_NOBODY);
                        else {
                            message.author.send(messages[args[1].toUpperCase()]);
                            message.channel.send(messages.DM_SEND)
                        }
                }
            }
            break;

    }


});

bot.login(TOKEN);

