messages = require('../../variable/message.js');
debugEmbed = require('../../variable/debugEmbed');
date = require('../../utils/date');
config = require('../../variable/config');
os = require('os');

module.exports = function(args, message, bot) {
    if(!message.guild) message.channel.send(messages.DM_BLOCK);
    else if(!message.member.permissions.has("ADMINISTRATOR")) message.delete(0);
    else if(!args[0]) message.channel.send(messages.ARGUMENT_NOBODY.replace("%1", "1"));
    else {
        switch(args[0]) {

            case "msg":
                if(!args[1]) message.channel.send(messages.ARGUMENT_NOBODY.replace("%1", "2"));
                else if(!messages[args[1]]) message.channel.send(messages.TEST_MSG_NOBODY);
                else {
                    message.author.send(messages[args[1].toUpperCase()]);
                    message.channel.send(messages.DM_SEND)
                }
                break;

            case "info":
                debugEmbed.fields[0].value = config.VERSION;
                debugEmbed.fields[1].value = os.hostname();
                debugEmbed.fields[2].value = date.toHHMMSS(os.uptime());
                debugEmbed.fields[3].value = date.toHHMMSS(process.uptime());
                message.channel.send({embed : debugEmbed});
                break;

            case "ping":
                message.channel.send("Pong ! " + Math.round(bot.ping) + "ms");
                break;

            case "restart":
                if(message.author.id === config.OWNER_ID) {
                    message.channel.send("Redémarrage...").then(() => {
                        process.kill(process.pid, "SIGINT");
                    });
                } else {
                    message.channel.send(messages.OWNER_INVALID);
                }
                break;
        }
    }
};