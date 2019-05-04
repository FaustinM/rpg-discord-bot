const messages = require('../../variable/message');
const disUtils = require('../../utils/discordUtils');

const reset = require('./money/reset');
const bal = require('./money/bal');
const remove = require('./money/remove');
const add = require('./money/add');

module.exports = function(dbUtils, message, args) {
    if(!message.guild) {
        message.channel.send(messages.DM_BLOCK);
    } else if(message.member.permissions.has("ADMINISTRATOR")) {
        switch(args[0]) {
            default:
                break;

            case "add":
                add(dbUtils, args, message);
                break;

            case "remove":
                remove(dbUtils, args, message);
                break;

            case "bal":
                bal(dbUtils, args, message);
                break;

            case "reset":
                reset(dbUtils, args, message);
                break;
        }
    } else {
        message.delete(0);
    }
};
