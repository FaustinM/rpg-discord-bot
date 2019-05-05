const Discord = require('discord.js');

const manager = require("./module/core/gestionCommands");
const config = require('./module/core/config');

const gestionCommand = require('./module/commands/admin/gestion');

const userAlias = require('./module/variable/userCommand');
const messages = require('./module/variable/message');

const changeChannel = require('./module/utils/channel');
let dbUtils = require('./module/utils/dbUtils');
//let formUtils = require('./module/utils/form');

const embedVar = {
    help : require('./module/variable/help'),
};
const forms = {
    join : require("./module/variable/joinForm"),
};

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.on('ready', function() {
    console.log("Je suis connecté !");
});

bot.on('guildMemberAdd', (member) => {
    if(!member.user.bot) {
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

bot.on('message', message => {
    const args = message.content.toLowerCase().split(' ');
    const command = args.shift().toLowerCase();

    if(message.content.startsWith("*sors pour aller à") && message.content.endsWith("*")) {
        if(!message.guild) {
            message.channel.send(messages.DM_BLOCK);
        }
        const lieu = message.content.substring(19, message.content.length - 1).toLowerCase();
        const lieuC = message.guild.channels.find(channel => channel.name === lieu) || message.guild.channels.get(lieu);
        if(lieuC) {
            changeChannel(lieuC, message, dbUtils);
        } else {
            dbUtils.findChannel(lieu, (data, rsp) => {
                const aliasDest = message.guild.channels.get(rsp);
                switch(data) {
                    case false:
                        message.delete(0);
                        break;
                    case true:
                        changeChannel(aliasDest, message, dbUtils);
                        break;
                    case "nobody":
                        message.delete(0);
                }
            })
        }
    } else if(userAlias.money.includes(message.content)) {
        if(!message.guild) {
            message.channel.send(messages.DM_BLOCK);
        }
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
    } else if(message.content === "J'adore Raenias !") {
        if(!message.guild) {
            //formUtils.sendForm(bot, forms.join, message);
        } else {
            message.delete(0);
        }
    } else {
        for(let key in manager.commands) {
            if(manager.commands.hasOwnProperty(key) && command === config.PREFIX + manager.commands[key].name) {
                if(!manager.commands[key].msg && !message.guild){
                    message.channel.send(messages.DM_BLOCK);
                    break;
                }
                switch(manager.state(manager.commands[key].name)) {
                    default :
                        break;

                    case "error":
                        message.channel.send(messages.COMMANDS_ERROR);
                        break;

                    case false:
                        message.channel.send(messages.COMMANDS_OFF);
                        break;

                    case true:
                        manager.commands[key].code(args, message, dbUtils, bot);
                }
                break;
            }
        }
    }
    if(command === "!gestion") gestionCommand(args, message, manager);
});

process.on('SIGINT', function() {
    bot.destroy().catch((err) => {
        console.error(err);
    });
    dbUtils.client.close();
});
process.on('SIGTERM', function() {
    bot.destroy().catch((err) => {
        console.error(err);
    });
    dbUtils.client.close();
});

bot.login(TOKEN);
manager.load();

