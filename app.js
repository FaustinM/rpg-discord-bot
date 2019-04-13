const Discord = require('discord.js');
const MongoClient = require("mongodb").MongoClient;
const config = require('./module/variable/config');
const disUtils = require('./module/utils/discord-utils');
const embedVar = {
    help : require('./module/variable/help'),
};
const messages = require('./module/variable/message');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const client = new MongoClient(config.url_db);

bot.on('ready', function() {
    console.log("Je suis connecté !");
});

bot.on('guildMemberAdd', (member) => {
    member.send(messages.JOIN);
});

client.connect(function(error) {
    if(error) throw error;
    client.db(config.name_db);
    console.log("Connecté à la base de donnée du bot");
    console.log("Nombre de fiche : " + client.db(config.name_db).collection("Fiche").estimatedDocumentCount({}, (err, num) => {
        return num
    }))
});

function changeChannel(destination, msg) {
    checkRole(destination.id,(state, rsp, msg) => {
        switch(state) {
            default:
                break;

            case false:
                rsp.delete(0);
                break;

            case true:
                if(msg.member.roles.get(rsp)){
                    msg.channel.overwritePermissions(msg.author, {READ_MESSAGES : null}, "Changement de channel (RP)").catch(console.error);
                    destination.overwritePermissions(msg.author, {READ_MESSAGES : true}).catch(console.error);
                } else {
                    msg.channel.send(":key2: Je ne peux pas te laisser rentrer dans ce lieu !");
                }
        }
    }, msg);
}

function checkRole(id, callback, msg) {
    client.db(config.name_db).collection("Channel").findOne({"channelId" : id}, (err, rsp) => {
        if(err) {
            console.error(err, msg);
            callback(false, msg);
        } else if(!rsp) callback(false, msg);
        else if(rsp) callback(true, rsp.role, msg);
    })
}

function addAlias(channelId, alias, callback) {
    if(alias === "" || alias === " " || !alias) {
        callback("nobody");
    } else {
        client.db(config.name_db).collection("aliasChannel").findOne({"alias" : alias}, (err, rsp) => {
            if(!rsp) client.db(config.name_db).collection("aliasChannel").insertOne({
                channelId : channelId,
                alias : alias
            }, (err) => {
                if(err) {
                    console.error(err);
                    callback(false)
                } else {
                    callback(true)
                }
            });
            else if(err) callback(false);
            else if(rsp) callback("two")
        });
    }
}

function removeAlias(alias, callback) {
    client.db(config.name_db).collection("aliasChannel").deleteOne({"alias" : alias}, (err, rsp) => {
        if(err) callback(false);
        else if(rsp.deletedCount === 0) callback("nobody");
        else if(rsp.deletedCount === 1) callback(true)
    })
}

function addRole(channel, role, callback) {
    client.db(config.name_db).collection("Channel").findOne({channelId : channel}, (err, rsp) => {
        if(err) {
            console.error(err);
            callback(false)
        } else if(rsp) {
            client.db(config.name_db).collection("Channel").updateOne({channelId : channel}, {
                $set : {
                    channelId : channel,
                    role : role
                }
            }, (err, rsp) => {
                if(err) {
                    console.error(err);
                    callback(false)
                } else if(rsp) {
                    callback("modify");
                }
            })
        } else if(!rsp) {
            client.db(config.name_db).collection("Channel").insertOne({
                channelId : channel,
                role : role
            }, (err, rsp) => {
                if(err) {
                    console.error(err);
                    callback(false);
                } else if(rsp) {
                    callback("add")
                }
            })
        }
    });
}

function findAias(alias, callback) {
    client.db(config.name_db).collection("aliasChannel").findOne({"alias" : alias}, (err, rsp) => {
        if(err) {
            console.error(err);
            callback(false);
        } else if(!rsp) callback("nobody");
        else if(rsp) callback(true, rsp.channelId);
    })
}

bot.on('message', message => {
    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if(message.content.startsWith("*sors pour aller à")) {
        const lieu = message.content.substring(19, message.content.length - 1).toLowerCase();
        const lieuC = message.guild.channels.find(channel => channel.name === lieu) || message.guild.channels.get(lieu);
        if(lieuC) {
            changeChannel(lieuC, message);
        } else {
            findAias(lieu, (data, rsp) => {
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
    }

    switch(command) {
        default:
            break;
        case "!channel":
            if(!message.guild.available) {
                message.channel.send(":frowning2: Malheureusement, j'ai l'impression que vous n'êtes pas dans un serveur Discord...")
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
                                        message.channel.send(":frowning2: Le nom de votre channel est incorect...");
                                        return;
                                    }
                                    nameAlias = args.slice(3).join(" ").toLowerCase();
                                    addAlias(channelID, nameAlias, (data) => {
                                        switch(data) {
                                            case "nobody":
                                                message.channel.send(":frowning2: Le nom de votre alias est incorect...");
                                                break;
                                            case true:
                                                message.channel.send(":tools: L'alias du channel " + channelID.toString() + " est " + nameAlias.toString());
                                                break;
                                            case "two":
                                                message.channel.send(":frowning2: Vous avez déjà crée une entrée avec cette alias");
                                                break;
                                            case false:
                                                message.channel.send(":frowning2: Une erreur inconnu est arrivée");
                                                break;
                                        }
                                    });
                                    break;

                                case "remove" :
                                    nameAlias = args.slice(2).join(" ").toLowerCase();
                                    removeAlias(nameAlias, (data) => {
                                        switch(data) {
                                            case true:
                                                message.channel.send(":tools: L'alias \"" + nameAlias.toString() + "\" à bien été supprimée");
                                                break;
                                            case false:
                                                message.channel.send(":frowning2: Une erreur inconnu est arrivée");
                                                break;
                                            case "nobody" :
                                                message.channel.send(":frowning2: Vous avez aucune entrée avec cette alias");
                                                break;

                                        }
                                    })

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
                                addRole(channel.id, role.id, (data) => {
                                    switch(data) {
                                        case "modify":
                                            message.channel.send(":tools: Le role " + args[2] + " à été modifié pour le channel : " + args[1]);
                                            break;

                                        case "add":
                                            message.channel.send(":tools: Le role " + args[2] + " à été défini pour le channel : " + args[1]);
                                            break;

                                        case false:
                                            message.channel.send(":frowning2: Une erreur inconnu est arrivée");
                                            break;

                                    }
                                })
                            } else {
                                message.channel.send(":frowning2: Le role n'existe pas !");
                            }
                        } else {
                            message.channel.send(":frowning2: Le channel n'existe pas !");
                        }
                }
            } else {
                message.delete(0);
            }
            break;
        case "!move":
            if(message.member.permissions.has("ADMINISTRATOR")){
                const user = message.guild.members.get(args[0]) || message.guild.members.find(user => user.nickname === args[0]) || message.guild.members.get(disUtils.getChannel(args[0]));
                const dest = message.guild.channels.get(args[1]) || message.guild.channels.find(channel => channel.name === args[1]) || message.guild.channels.get(disUtils.getChannel(args[1]));
                if(!dest){
                    message.channel.send(":frowning2: Le channel n'existe pas !");
                } else if(!user){
                    message.channel.send(":frowning2: L'utilisateur n'existe pas !");
                } else if(user && dest){
                    const lost = message.guild.channels.find(channel => channel.memberPermissions(user).has("READ_MESSAGES") && channel.memberPermissions(user).has("SEND_MESSAGES") && (channel.type === "text") === true);
                    lost.overwritePermissions(user, {READ_MESSAGES : null}, "Changement de channel (RP)").catch(console.error);
                    dest.overwritePermissions(user, {READ_MESSAGES : true}).catch(console.error);
                }
            } else {
                message.delete(0);
            }
            break;

        case "!help":
            if(message.member.permissions.has("ADMINISTRATOR")){
                message.reply({embed : embedVar.help});
            } else {
                message.delete(0);
            }
    }


});

bot.login(TOKEN);

